// Automatically mark payment as completed for exempted categories
import { useState, useEffect } from "react";
import { useRegistrationData } from "@/hooks/useRegistrationData";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, CreditCard, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";

export function Payment() {
  const { updateLocalData, loadRegistrationData } = useRegistrationData();
  // Automatically mark payment as completed for exempted categories
  
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const markExemptedPayment = async () => {
      if (!user || !["sc", "st"].includes(category.toLowerCase())) return;
      // Get user's application
      const { data: app } = await supabase
        .from("applications")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!app) return;
      // Check if payment already exists and is completed
      const { data: payment } = await supabase
        .from("payments")
        .select("id, payment_status")
        .eq("application_id", app.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (payment && payment.payment_status === "completed") {
        setPaymentStatus("completed");
        return;
      }
      // Insert payment record for exempted category
      const { error } = await supabase
        .from("payments")
        .insert({
          application_id: app.id,
          amount: 0,
          payment_status: "completed",
          payment_method: "exempted",
          payment_date: new Date().toISOString(),
        });
      if (!error) {
        setPaymentStatus("completed");
        fetchPaymentDetails();
      }
    };
    markExemptedPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, category]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCategoryAndAmount();
    fetchPaymentDetails();
  }, [user, loading, navigate]);

  // Fetch user's category and payment amount
  const fetchCategoryAndAmount = async () => {
    if (!user) return;
    // Get user's category from personal_info
    const { data: personalInfo, error: infoError } = await supabase
      .from("personal_info")
      .select("category")
      .eq("user_id", user.id)
      .single();
    if (infoError || !personalInfo) {
      setCategory("");
      setAmount(0);
      return;
    }
    setCategory(personalInfo.category);
    // Get amount from category_payments
    //@ts-ignore
    const { data: catPay, error: catError } = await supabase
      .from("category_payments")
      .select("amount")
      .eq("category", personalInfo.category)
      .single();
    setAmount(catPay?.amount ?? 0);
  };

  // Fetch payment details for current application
  const fetchPaymentDetails = async () => {
    if (!user) return;
    // Get user's application
    const { data: app, error: appError } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!app) return;
    // Get payment for application
    const { data: payment, error: payError } = await supabase
      .from("payments")
      .select("*")
      .eq("application_id", app.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (payment) {
      setPaymentDetails(payment);
      setPaymentStatus(payment.payment_status);
      updateLocalData('paymentDetails', payment);
    }
  };

  // Mock Razorpay payment
  const handlePayNow = async () => {
    setShowPaymentModal(true);
  };

  const handleMockPayment = async () => {
    setIsLoading(true);
    try {
      // Get user's application
      const { data: app, error: appError } = await supabase
        .from("applications")
        .select("id, user_id, post_id, application_number, status")
        .eq("user_id", user.id)
        .single();
      console.log("Fetched application for payment:", app, "Error:", appError, "User ID:", user.id);
      if (!app) throw new Error("Application not found");
      // Mock Razorpay details
      const razorpay_order_id = "order_mock_" + Date.now();
      const razorpay_payment_id = "pay_mock_" + Date.now();
      const razorpay_signature = "sig_mock_" + Date.now();
      // Insert payment
      const { error } = await supabase
        .from("payments")
        .insert({
          application_id: app.id,
          amount,
          payment_status: "completed",
          payment_method: "razorpay",
          transaction_id: razorpay_payment_id,
          payment_date: new Date().toISOString(),
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });
      if (error) throw error;
      setPaymentStatus("completed");
      fetchPaymentDetails();
      await loadRegistrationData();
      toast({
        title: "Payment Successful",
        description: "Your payment has been completed.",
      });
      setShowPaymentModal(false);
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/final-preview");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge className="gov-badge mb-4">Payment</Badge>
            <h1 className="text-4xl font-heading font-bold text-gradient-primary mb-4">
              Complete Your Payment
            </h1>
            <p className="text-muted-foreground">
              Please review your payment details and proceed.
            </p>
          </motion.div>

          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-heading text-gradient-primary flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-left">
                <div><strong>Category:</strong> {category || "-"}</div>
                <div><strong>Amount:</strong> ₹{amount.toFixed(2)}</div>
                <div><strong>Status:</strong> {paymentStatus === "completed" ? (
                  <span className="text-success">Completed <CheckCircle className="inline h-4 w-4" /></span>
                ) : ["sc", "st"].includes(category.toLowerCase()) ? (
                  <span className="text-success">Exempted <CheckCircle className="inline h-4 w-4" /></span>
                ) : (
                  <span className="text-warning">Pending <Clock className="inline h-4 w-4" /></span>
                )}</div>
                {paymentDetails && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div><strong>Payment Method:</strong> {paymentDetails.payment_method}</div>
                    <div><strong>Transaction ID:</strong> {paymentDetails.transaction_id}</div>
                    <div><strong>Payment Date:</strong> {paymentDetails.payment_date ? new Date(paymentDetails.payment_date).toLocaleString() : "-"}</div>
                  </div>
                )}
              </div>
              {!["sc", "st"].includes(category.toLowerCase()) && amount > 0 && paymentStatus !== "completed" && (
                <>
                  <Button
                    onClick={handlePayNow}
                    disabled={isLoading}
                    variant="default"
                    className="mt-6 w-full"
                  >
                    Proceed to Payment
                  </Button>
                  <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                    <DialogContent>
                      <h2 className="text-lg font-bold mb-2">Mock Razorpay Payment</h2>
                      <p className="mb-4">Amount to pay: <strong>₹{amount.toFixed(2)}</strong></p>
                      <Button onClick={handleMockPayment} disabled={isLoading} variant="default" className="w-full mb-2">
                        {isLoading ? "Processing..." : "Confirm Payment"}
                      </Button>
                      <DialogClose asChild>
                        <Button variant="ghost" className="w-full" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {["sc", "st"].includes(category.toLowerCase()) && (
                <div className="mt-4 text-success">You are exempted from payment for your category.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
