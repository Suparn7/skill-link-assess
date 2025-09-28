import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Calendar, Check, Info } from "lucide-react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
  required?: boolean;
  type?: string;
  options?: { label: string; value: string }[];
  className?: string;
}

export function FormField({
  label,
  error,
  icon,
  helper,
  required,
  type = "text",
  options,
  className,
  ...props
}: FormFieldProps) {
  const id = React.useId();
  const [focused, setFocused] = React.useState(false);

  const renderInput = () => {
    if (type === "select" && options) {
      return (
        <Select 
          onValueChange={(value) => props.onChange?.({ target: { value }} as any)}
          value={props.value?.toString()}
        >
          <SelectTrigger 
            className={cn(
              "form-glass",
              error && "border-destructive",
              focused && "ring-2 ring-primary/20",
              icon && "pl-10"
            )}
          >
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (type === "textarea") {
      return (
        <Textarea
          {...props as any}
          id={id}
          className={cn(
            "form-glass min-h-[100px] resize-none",
            error && "border-destructive",
            focused && "ring-2 ring-primary/20",
            icon && "pl-10",
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      );
    }

    if (type === "date") {
      return (
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            {...props}
            id={id}
            type="date"
            className={cn(
              "form-glass pl-10",
              error && "border-destructive",
              focused && "ring-2 ring-primary/20",
              className
            )}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>
      );
    }

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          {...props}
          id={id}
          type={type}
          className={cn(
            "form-glass transition-all duration-200",
            error && "border-destructive",
            focused && "ring-2 ring-primary/20",
            icon && "pl-10",
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    );
  };

  return (
    <div className="form-control">
      <div className="flex items-center justify-between">
        <Label 
          htmlFor={id}
          className={cn(
            "form-label transition-colors duration-200",
            focused && "text-primary"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {helper && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="h-3 w-3 mr-1" />
            {helper}
          </div>
        )}
      </div>
      {renderInput()}
      {error && (
        <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-destructive inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}