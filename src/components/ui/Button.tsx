/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size    = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-soft hover:shadow-glow hover:from-primary-800 hover:to-primary-600 disabled:from-primary-300 disabled:to-primary-300",
  secondary:
    "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 disabled:text-primary-300",
  outline:
    "border border-surface-200 bg-white text-surface-500 hover:bg-surface-50 hover:border-primary-300 hover:text-primary-600 disabled:opacity-50",
  ghost:
    "bg-transparent text-surface-500 hover:bg-surface-100 hover:text-surface-700 disabled:opacity-50",
  danger:
    "bg-red-500 text-white hover:bg-red-600 shadow-soft disabled:bg-red-300",
};

const sizeStyles: Record<Size, string> = {
  sm:   "h-8  px-3  text-sm  rounded-xl  gap-1.5",
  md:   "h-10 px-5  text-sm  rounded-2xl gap-2",
  lg:   "h-12 px-7  text-base rounded-2xl gap-2.5",
  icon: "h-10 w-10 text-sm  rounded-2xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref as any}
        whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
        whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "btn-tap inline-flex items-center justify-center font-semibold",
          "transition-all duration-200 ease-out",
          "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...(props as HTMLMotionProps<"button">)}
      >
        {loading ? (
          <>
            <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export { Button };
