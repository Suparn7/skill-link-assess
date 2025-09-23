import { Check, CircleDot } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface FormProgressProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
}

export function FormProgress({ steps, currentStep, onChange }: FormProgressProps) {
  return (
    <div className="mb-8">
      <div className="form-progress">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <motion.div
              key={step.id}
              className={`form-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onChange?.(step.id)}
              style={{ cursor: onChange ? 'pointer' : 'default' }}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex h-6 w-6 items-center justify-center">
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isActive ? (
                    <CircleDot className="h-4 w-4" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{step.title}</span>
                  {step.description && (
                    <span className="text-xs text-muted-foreground">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className="absolute right-0 top-1/2 h-px w-full -translate-y-1/2 bg-muted"
                  style={{
                    background: `linear-gradient(to right, 
                      ${isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 50%, 
                      hsl(var(--muted)) 50%)`
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}