"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  hint?:     string;
  error?:    string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leftIcon, rightElement, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-semibold transition-colors duration-200",
              focused ? "text-primary-600" : "text-surface-500"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center group">
          {leftIcon && (
            <div className={cn(
              "absolute left-3.5 flex items-center pointer-events-none transition-colors duration-200",
              focused ? "text-primary-500" : "text-surface-400"
            )}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
            onBlur={(e)  => { setFocused(false); props.onBlur?.(e); }}
            className={cn(
              "w-full bg-white border-2 text-sm font-medium text-surface-900 rounded-2xl",
              "transition-all duration-200 ease-out",
              "placeholder:text-surface-300 placeholder:font-normal",
              "h-11",
              leftIcon    ? "pl-10" : "pl-4",
              rightElement ? "pr-12" : "pr-4",
              error
                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100",
              "outline-none",
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {hint && !error && (
          <p className="text-xs text-surface-400 pl-1">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-500 font-medium pl-1 animate-fade-up">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };

// ─── Textarea Variant ────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?:  string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-semibold transition-colors duration-200",
              focused ? "text-primary-600" : "text-surface-500"
            )}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e); }}
          className={cn(
            "w-full bg-white border-2 text-sm font-medium text-surface-900 rounded-2xl px-4 py-3",
            "transition-all duration-200 ease-out resize-none",
            "placeholder:text-surface-300 placeholder:font-normal",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100",
            "outline-none",
            className
          )}
          {...props}
        />

        {hint && !error && (
          <p className="text-xs text-surface-400 pl-1">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-500 font-medium pl-1 animate-fade-up">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
