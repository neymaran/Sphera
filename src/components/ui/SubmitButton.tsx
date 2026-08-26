"use client";

import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-soft hover:shadow-glow disabled:from-primary-300 disabled:to-primary-300 disabled:cursor-not-allowed",
  secondary:
    "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-red-500 text-white hover:bg-red-600 shadow-soft disabled:bg-red-300 disabled:cursor-not-allowed",
};

const sizeStyles = {
  sm: "h-9 px-4 text-sm rounded-2xl gap-1.5",
  md: "h-11 px-6 text-sm rounded-2xl gap-2",
  lg: "h-12 px-7 text-base rounded-2xl gap-2.5",
};

export function SubmitButton({
  children,
  loadingText,
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  disabled,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = pending;

  return (
    <motion.button
      type="submit"
      disabled={isLoading || disabled}
      whileTap={{ scale: isLoading ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "relative inline-flex items-center justify-center font-bold",
        "transition-all duration-200 ease-out select-none w-full",
        "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {/* Loading overlay shimmer */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      )}

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {isLoading ? (
          <>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 size={16} className="animate-spin" />
            </motion.span>
            <motion.span
              key="loading-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {loadingText || "Processando..."}
            </motion.span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <motion.span
              key="idle-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </span>
    </motion.button>
  );
}
