import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { SMSService, generateOTP } from "@/lib/sms";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, ArrowLeft, Clock, CheckCircle, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";

export function PhoneVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user is already verified
    checkVerificationStatus();
  }, [user, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const checkVerificationStatus = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_verified, mobile_number')
        .eq('user_id', user.id)
        .single();

      console.log('Profile fetched from Supabase:', profile);
      console.log('phone_verified value:', profile?.phone_verified);

      if (profile?.phone_verified) {
        console.log('User is verified, navigating to /register');
        navigate('/register');
      } else if (profile?.mobile_number) {
        setMobile(profile.mobile_number);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleSendOtp = async () => {
    if (!mobile.trim() || mobile.length < 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const otpCode = generateOTP();
      setGeneratedOtp(otpCode);

      // Store OTP in database
      await supabase
        .from('phone_otps')
        .insert({
          user_id: user!.id,
          mobile: mobile,
          code: otpCode,
          purpose: 'registration',
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        });

      // Send SMS
      const smsResult = await SMSService.sendOTP(mobile, otpCode);
      
      if (smsResult) {
        // Update profile with mobile number
        await supabase
          .from('profiles')
          .update({ mobile_number: mobile })
          .eq('user_id', user!.id);

        setStep('otp');
        setTimeLeft(120); // 2 minutes
        setCanResend(false);
        
        toast({
          title: "OTP Sent Successfully",
          description: `Verification code sent to ${mobile}`,
        });
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Failed to Send OTP",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP from database
      const { data: otpRecord, error } = await supabase
        .from('phone_otps')
        .select('*')
        .eq('user_id', user!.id)
        .eq('mobile', mobile)
        .eq('code', otp)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !otpRecord) {
        toast({
          title: "Invalid or Expired OTP",
          description: "Please check the code or request a new one",
          variant: "destructive"
        });
        return;
      }

      // Mark OTP as used
      await supabase
        .from('phone_otps')
        .update({ used: true })
        .eq('id', otpRecord.id);

      // Mark profile as verified
      await supabase
        .from('profiles')
        .update({ phone_verified: true })
        .eq('user_id', user!.id);

      toast({
        title: "Phone Verified Successfully!",
        description: "You can now proceed to exam registration",
      });

      navigate('/register');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    // Mark previous OTPs as used
    await supabase
      .from('phone_otps')
      .update({ used: true })
      .eq('user_id', user!.id)
      .eq('mobile', mobile)
      .eq('used', false);

    await handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Phone Verification
            </h1>
            <p className="text-muted-foreground">
              {step === 'phone' 
                ? "Enter your mobile number to receive verification code"
                : "Enter the 6-digit code sent to your mobile"
              }
            </p>
          </motion.div>

          {/* Main Card */}
          <Card className="glass-card p-6">
            {step === 'phone' ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="mobile" className="text-sm font-medium text-foreground">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      +91
                    </span>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-12"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send a verification code to this number
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || mobile.length !== 10}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Code sent to: <span className="font-medium text-foreground">+91 {mobile}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-foreground">
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                {timeLeft > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Resend in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('phone')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change Number
                  </Button>
                  
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    className="flex-1 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>

                {canResend && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-primary hover:text-primary/80"
                    >
                      Didn't receive code? Resend
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </Card>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Having trouble? Contact support at{" "}
              <a href="mailto:janmce.helpdesk@gmail.com" className="text-primary hover:underline">
                janmce.helpdesk@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}