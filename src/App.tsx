import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import "./lib/i18n";

// Pages
import { HomePage } from "./pages/HomePage";
import { ImportantDates } from "./pages/ImportantDates";
import { HowToApply } from "./pages/HowToApply";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { PersonalInfo } from "./pages/PersonalInfo";
import { Education } from "./pages/Education";
import { Experience } from "./pages/Experience";
import { Auth } from "./pages/Auth";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DocumentsUpload } from "./pages/DocumentsUpload";
import { Payment } from "./pages/Payment";
import { FinalPreview } from "./pages/FinalPreview";
import FinalSubmit from "./pages/FinalSubmit";
import { ExamRegistration } from "./pages/ExamRegistration";
import { EnhancedAuth } from "./pages/EnhancedAuth";
import { PhoneVerification } from "./pages/PhoneVerification";
import { AuthProvider } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="glass-card p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);


const App = () => {
  useEffect(() => {
    // Test Supabase fetch for profiles table
    const testFetch = async () => {
      try {
        const { data, error, status, statusText } = await supabase
          .from('profiles')
          .select('phone_verified, mobile_number')
          .limit(1);
        console.log('Supabase profiles fetch:', { data, error, status, statusText });
        if (error) {
          console.error('Supabase fetch error:', error.message, error.details, error.hint);
        }
      } catch (err) {
        console.error('Supabase fetch exception:', err);
      }
    };
    testFetch();
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/important-dates" element={<ImportantDates />} />
              <Route path="/how-to-apply" element={<HowToApply />} />
              <Route path="/verify-phone" element={<PhoneVerification />} />
              <Route path="/register" element={<ExamRegistration />} />
              <Route path="/auth" element={<EnhancedAuth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/personal-info" element={<PersonalInfo />} />
              <Route path="/education" element={<Education />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/documents" element={<DocumentsUpload />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/final-preview" element={<FinalPreview />} />
              <Route path="/final-submit" element={<FinalSubmit />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
