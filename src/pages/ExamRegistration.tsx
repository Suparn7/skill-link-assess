import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { RegistrationStepper } from "@/components/registration/RegistrationStepper";
import { ProtectedRoute } from "@/components/registration/ProtectedRoute";
import { ApplicationStatusGuard } from "@/components/registration/ApplicationStatusGuard";
import { PersonalInfoForm } from "@/pages/PersonalInfoForm";
import { OtherDetailsForm } from "@/pages/OtherDetailsForm";
import { ExperienceInfoForm } from "@/pages/ExperienceInfoForm";
import { UploadDocumentsForm } from "@/pages/UploadDocumentsForm";
import { PaymentInfoForm } from "@/pages/PaymentInfoForm";
import { FinalReviewForm } from "@/pages/FinalReviewForm";
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
  Save
} from "lucide-react";

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
    title: "Education",
    description: "Qualifications",
    icon: GraduationCap,
    component: "Education"
  },
  {
    id: 3,
    title: "Experience",
    description: "Work history",
    icon: Briefcase,
    component: "Experience"
  },
  {
    id: 4,
    title: "Documents",
    description: "Upload files",
    icon: Upload,
    component: "Documents"
  },
  {
    id: 5,
    title: "Payment",
    description: "Fee payment",
    icon: CreditCard,
    component: "Payment"
  },
  {
    id: 6,
    title: "Review",
    description: "Final check",
    icon: FileCheck,
    component: "Review"
  }
];

export function ExamRegistration() {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, loading, saving, savePersonalInfo, saveEducationInfo, saveExperienceInfo, updateLocalData, ensureApplication } = useRegistrationData();
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
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Determine the current step based on completed steps
    const maxCompletedStep = Math.max(0, ...data.completedSteps);
    const nextStep = maxCompletedStep < 6 ? maxCompletedStep + 1 : 6;
    setCurrentStep(nextStep);
  }, [data.completedSteps]);

  const steps = REGISTRATION_STEPS.map(step => ({
    ...step,
    completed: data.completedSteps.includes(step.id),
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
    if (currentStep < 6) {
      // Save current step data before proceeding
      const saveSuccess = await handleSaveCurrentStep();
      if (saveSuccess) {
        setCurrentStep(prev => prev + 1);
      }
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
          const personalSaved = await savePersonalInfo(data.personalInfo);
          // Ensure application is created after personal info is saved and postId is available
          if (personalSaved && data.personalInfo.postId) {
            await ensureApplication((data.personalInfo as any).postId);
          }
          return personalSaved;
        }
        case 2:
          return await saveEducationInfo(data.educationInfo);
        case 3:
          return await saveExperienceInfo(data.experienceInfo);
        default:
          return true;
      }
    } catch (error) {
      console.error('Error saving step:', error);
      toast({
        title: "Error Saving Data",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
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
        return (
          <div>
            <PersonalInfoForm
              data={data.personalInfo as any}
              onChange={handlePersonalInfoChange}
              onNext={handleNext}
            />
            <div className="mt-6">
              <label className="block font-medium mb-2">Select Exam/Post</label>
              {postsLoading ? (
                <div>Loading posts...</div>
              ) : (
                <select
                  className="w-full border rounded px-3 py-2"
                  value={(data.personalInfo as any).postId || ''}
                  onChange={e => handlePersonalInfoChange('postId', e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {posts.map(post => (
                    <option key={post.id} value={post.id}>{post.post_name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <OtherDetailsForm
            data={data.personalInfo as any}
            onChange={handlePersonalInfoChange}
            onBack={handlePrevious}
            onNext={handleNext}
            isLoading={saving}
          />
        );
      case 3:
        return (
          <ExperienceInfoForm
            data={data.experienceInfo as any}
            onChange={(field, value) => updateLocalData('experienceInfo', value)}
            onBack={handlePrevious}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <UploadDocumentsForm
            data={data.personalInfo as any}
            onChange={handlePersonalInfoChange}
            onSubmit={handleNext}
          />
        );
      case 5:
        return (
          <PaymentInfoForm
            data={data.personalInfo as any}
            onProceed={handleNext}
          />
        );
      case 6:
        return (
          <FinalReviewForm
            data={{...data.personalInfo, ...data.applicationInfo}}
            onSubmit={handleSubmitRegistration}
          />
        );
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep !== 1 && (
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={saving || currentStep === 6}
                    className="flex items-center gap-2"
                  >
                    {currentStep === 6 ? "Submit Application" : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
          </main>
        </div>
      </ApplicationStatusGuard>
    </ProtectedRoute>
  );
}