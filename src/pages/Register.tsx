import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateOTP, generateRegistrationNumber, generatePassword, SMSService } from "@/lib/sms";

export function Register() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    category: '',
    mobile: '',
    email: '',
    aadharNumber: '',
    address: '',
    state: 'Jharkhand',
    district: '',
    pincode: '',
    otp: '',
    agreedToTerms: false
  });

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOTP = async () => {
    if (!formData.mobile) {
      toast({
        title: "Error",
        description: "Please enter your mobile number first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const otp = generateOTP();
    setGeneratedOTP(otp);

    try {
      const success = await SMSService.sendOTP(formData.mobile, otp);
      if (success) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your mobile number",
          variant: "default"
        });
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (formData.otp === generatedOTP) {
      setStep(2);
      toast({
        title: "Success",
        description: "Mobile number verified successfully",
        variant: "default"
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitRegistration = async () => {
    setIsLoading(true);
    
    // Generate credentials
    const regNumber = generateRegistrationNumber();
    const password = generatePassword();

    try {
      // Send registration success SMS
      const success = await SMSService.sendRegistrationSuccess(
        formData.mobile, 
        regNumber, 
        password
      );

      if (success) {
        toast({
          title: "Registration Successful!",
          description: `Registration Number: ${regNumber}. Password sent via SMS.`,
          variant: "default"
        });
        setStep(3);
      } else {
        throw new Error("Failed to send credentials");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
            <Phone className="h-6 w-6" />
            Mobile Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">{t('register.mobile')} *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="pl-10 form-glass"
                  maxLength={10}
                />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value)}
                    className="pl-10 form-glass"
                    maxLength={6}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {!otpSent ? (
              <Button 
                onClick={handleSendOTP} 
                disabled={isLoading || !formData.mobile}
                variant="default"
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={isLoading || !formData.otp}
                  variant="success"
                  className="flex-1"
                >
                  Verify OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => setOtpSent(false)} 
                  variant="ghost"
                >
                  Resend OTP
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
            <User className="h-6 w-6" />
            {t('register.personalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('register.firstName')} *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="form-glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('register.lastName')} *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="form-glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherName">{t('register.fatherName')} *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                className="form-glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherName">{t('register.motherName')} *</Label>
              <Input
                id="motherName"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                className="form-glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">{t('register.dob')} *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="pl-10 form-glass"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('register.email')} *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 form-glass"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('register.address')} *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="pl-10 form-glass"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => setStep(1)} 
              variant="ghost"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('register.back')}
            </Button>
            <Button 
              onClick={handleSubmitRegistration} 
              disabled={isLoading}
              variant="success"
              className="flex-1"
            >
              {isLoading ? "Processing..." : t('register.submit')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-success/30">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold text-success mb-4">
            Registration Successful!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your registration has been completed successfully. Registration credentials have been sent to your mobile number via SMS.
          </p>
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-success-foreground">
              Please save your registration number and password for future login.
            </p>
          </div>
          <Button variant="default" size="lg" className="w-full">
            Continue to Application
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge className="gov-badge mb-4">
              {t('home.subtitle')}
            </Badge>
            <h1 className="text-4xl font-heading font-bold text-gradient-primary mb-4">
              {t('register.title')}
            </h1>
            
            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber 
                        ? 'bg-gradient-primary text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step > stepNumber ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-12 h-0.5 ${
                        step > stepNumber ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>

      <Footer />
    </div>
  );
}