import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export function Textarea({
  label,
  helperText,
  error,
  className = "",
  id,
  required,
  ...props
}: TextareaProps) {
  const textareaId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-[13px] font-medium text-text-primary">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full rounded-md border border-border-default bg-bg-surface px-3 py-2 text-[14px] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-border-strong disabled:bg-bg-subtle ${error ? "border-danger" : ""} ${className}`}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {helperText && !error && (
        <p className="text-[12px] text-text-muted">{helperText}</p>
      )}
      {error && (
        <p className="text-[12px] text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
