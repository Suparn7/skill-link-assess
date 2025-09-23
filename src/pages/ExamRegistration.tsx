import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { RegistrationStepper } from "@/components/registration/RegistrationStepper";
import { ProtectedRoute } from "@/components/registration/ProtectedRoute";
import { PersonalInfoForm } from "@/pages/PersonalInfoForm";
import { useRegistrationData } from "@/hooks/useRegistrationData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, loading, saving, savePersonalInfo, updateLocalData } = useRegistrationData();
  
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
      await handleSaveCurrentStep();
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return await savePersonalInfo(data.personalInfo);
      case 2:
        // Implement education save
        return true;
      case 3:
        // Implement experience save
        return true;
      default:
        return true;
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
          <PersonalInfoForm
            data={data.personalInfo as any}
            onChange={handlePersonalInfoChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Education Information</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Experience Information</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Document Upload</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case 6:
        return (
          <div className="text-center py-12">
            <FileCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Final Review</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
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
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}