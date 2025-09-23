import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface RegistrationStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function RegistrationStepper({ steps, currentStep, onStepClick }: RegistrationStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`flex flex-col items-center cursor-pointer group ${
                onStepClick ? 'hover:scale-105' : ''
              }`}
              onClick={() => onStepClick?.(step.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Step Circle */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.current
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg'
                    : step.completed
                    ? 'bg-success border-success text-success-foreground'
                    : 'bg-card border-border text-muted-foreground group-hover:border-primary'
                }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="mt-3 text-center max-w-24">
                <h3
                  className={`text-sm font-medium transition-colors ${
                    step.current
                      ? 'text-primary'
                      : step.completed
                      ? 'text-success'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}