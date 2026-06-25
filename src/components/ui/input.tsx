import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export function Input({
  label,
  helperText,
  error,
  className = "",
  id,
  required,
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium text-text-primary">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`h-9 w-full rounded-md border border-border-default bg-bg-surface px-3 text-[14px] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-border-strong disabled:bg-bg-subtle disabled:text-text-muted ${error ? "border-danger" : ""} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-[12px] text-text-muted">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-[12px] text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
