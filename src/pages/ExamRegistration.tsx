import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { RegistrationStepper } from "@/components/registration/RegistrationStepper";
import { ProtectedRoute } from "@/components/registration/ProtectedRoute";
import { ApplicationStatusGuard } from "@/components/registration/ApplicationStatusGuard";
import { useRegistrationData } from "@/hooks/useRegistrationData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Upload, 
  CreditCard, 
  FileCheck,
  ArrowLeft,
  ArrowRight,
  Save,
  FileText
} from "lucide-react";
import { Education } from "@/pages/Education";
import { DocumentsUpload } from "@/pages/DocumentsUpload";
import { Payment } from "@/pages/Payment";
import { OtherDetails } from "@/pages/OtherDetails";
import { PersonalInfo } from "@/pages/PersonalInfo";
import { Experience } from "./Experience";
import { FinalPreview } from "@/pages/FinalPreview";

const REGISTRATION_STEPS = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic details",
    icon: User,
    component: "PersonalInfo"
  },
  {
    id: 2,
    title: "Other Details",
    description: "Additional info",
    icon: FileText,
    component: "OtherDetails"
  },
  {
    id: 3,
    title: "Education",
    description: "Qualifications",
    icon: GraduationCap,
    component: "Education"
  },
  {
    id: 4,
    title: "Experience",
    description: "Work history",
    icon: Briefcase,
    component: "Experience"
  },
  {
    id: 5,
    title: "Documents",
    description: "Upload files",
    icon: Upload,
    component: "Documents"
  },
  {
    id: 6,
    title: "Payment",
    description: "Fee payment",
    icon: CreditCard,
    component: "Payment"
  },
  {
    id: 7,
    title: "Review",
    description: "Final check",
    icon: FileCheck,
    component: "Review"
  }
];

export function ExamRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  // Removed stepper-next event listener. Navigation is handled by setCurrentStep and handleNext.
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, loading, saving, savePersonalInfo, saveEducationInfo, saveExperienceInfo, updateLocalData, ensureApplication } = useRegistrationData();

  // Debug: Log paymentDetails to verify its presence and value
  useEffect(() => {
    console.log('ExamRegistration paymentDetails:', data.paymentDetails);
  }, [data.paymentDetails]);

  // Patch: Add otherDetails to RegistrationData if missing
  if (!('otherDetails' in data)) {
    (data as any).otherDetails = {};
  }
  const { debounce, batchOperations, createCache } = usePerformanceOptimization();

  // Create cache for posts to reduce database calls
  const postsCache = createCache();

  useEffect(() => {
    const fetchPosts = async () => {
      const cacheKey = 'active_posts';
      const cachedPosts = postsCache.get(cacheKey);
      
      if (cachedPosts) {
        setPosts(cachedPosts);
        setPostsLoading(false);
        return;
      }

      setPostsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, post_name, post_code, is_active')
          .eq('is_active', true)
          .order('post_name');
        
        if (!error && data) {
          setPosts(data);
          postsCache.set(cacheKey, data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: "Failed to load exam posts",
          variant: "destructive"
        });
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, []);
  

  useEffect(() => {
    // Determine the current step based on completed steps and payment status
    const maxCompletedStep = Math.max(0, ...data.completedSteps);
    const paymentCompleted = data.paymentDetails?.payment_status === 'completed';
    // If all steps up to payment are done and payment is completed, go to FinalPreview
    if (maxCompletedStep >= 6 && paymentCompleted) {
      setCurrentStep(7);
    } else {
      const nextStep = maxCompletedStep < 6 ? maxCompletedStep + 1 : 6;
      setCurrentStep(nextStep);
    }
  }, [data.completedSteps, data.paymentDetails]);

  const steps = REGISTRATION_STEPS.map(step => ({
    ...step,
    completed:
      step.id === 6
        ? data.paymentDetails?.payment_status === 'completed'
        : data.completedSteps.includes(step.id),
    current: step.id === currentStep
  }));

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or the next immediate step
    const maxAllowedStep = Math.max(1, ...data.completedSteps) + 1;
    if (stepId <= maxAllowedStep) {
      setCurrentStep(stepId);
    } else {
      toast({
        title: "Complete Previous Steps",
        description: "Please complete the previous steps before proceeding",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    // Save current step data (but don't block progression)
    await handleSaveCurrentStep();
    
    // Always allow moving to next step
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveCurrentStep = async () => {
    try {
      switch (currentStep) {
        case 1: {
          // Save personal info - don't block if it fails
          try {
            await savePersonalInfo(data.personalInfo);
          } catch (err) {
            console.log('Personal info save error:', err);
          }
          return true;
        }
        case 2: {
          // Save Other Details - don't block if it fails
          try {
            const otherDetails = (data as any).otherDetails || {};
            const { error } = await supabase
              .from('other_details')
              .upsert({
                user_id: user?.id,
                ...otherDetails
              });
            if (error) console.log('Other details save error:', error);
          } catch (err) {
            console.log('Other details save error:', err);
          }
          return true;
        }
        case 3:
          try {
            await saveEducationInfo(data.educationInfo);
          } catch (err) {
            console.log('Education save error:', err);
          }
          return true;
        case 4:
          try {
            await saveExperienceInfo(data.experienceInfo);
          } catch (err) {
            console.log('Experience save error:', err);
          }
          return true;
        default:
          return true;
      }
    } catch (error) {
      console.error('Error saving step:', error);
      return true; // Still return true to allow navigation
    }
  };

  const handlePersonalInfoChange = (field: string, value: any) => {
    updateLocalData('personalInfo', {
      ...data.personalInfo,
      [field]: value
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo />;
      case 2:
        return <OtherDetails />;
      case 3:
        return <Education onNext={handleNext} />;
      case 4:
        return <Experience />;
      case 5:
        return <DocumentsUpload />;
      case 6: {
        return <Payment />;
      }
      case 7:
        return <FinalPreview />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading registration data...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requirePhoneVerification={true}>
      <ApplicationStatusGuard allowedStatuses={['draft', 'payment_pending', 'document_pending', 'payment_completed']}>
        <div className="min-h-screen bg-background">
          <Header />
          
          <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <User className="w-4 h-4" />
              Welcome, {user?.email}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-2"
            >
              Exam Registration Portal
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Complete your registration step by step. Your progress is automatically saved.
            </motion.p>
          </div>

          {/* Progress Stepper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RegistrationStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </motion.div>

          {/* Main Content */}
          <Card className="glass-card mt-8">
            <div className="p-6">
              {/* Step Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {React.createElement(steps[currentStep - 1]?.icon || User, {
                    className: "w-6 h-6 text-primary"
                  })}
                  <div>
                    <h2 className="text-xl font-semibold">
                      Step {currentStep}: {steps[currentStep - 1]?.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {steps[currentStep - 1]?.description}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveCurrentStep}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Progress"}
                </Button>
              </div>

              {/* Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                
                {currentStep < 7 && (
                  <Button
                    onClick={handleNext}
                    disabled={saving}
                    className="flex items-center gap-2 ml-auto"
                  >
                    {saving ? "Saving..." : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                
                {currentStep === 7 && (
                  <Button
                    onClick={() => navigate('/final-submit')}
                    disabled={saving}
                    className="flex items-center gap-2 ml-auto"
                  >
                    Submit Application
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
          </main>
        </div>
      </ApplicationStatusGuard>
    </ProtectedRoute>
  );
}