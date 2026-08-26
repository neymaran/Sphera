/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?:      boolean;
  glass?:      boolean;
  noPadding?:  boolean;
  elevated?:   boolean;
}

function Card({ className, hover = false, glass = false, noPadding = false, elevated = false, children, ...props }: CardProps) {
  const Comp = hover ? motion.div : "div";

  const motionProps = hover ? {
    whileHover:  { y: -3, boxShadow: "0 16px 48px rgba(30,58,138,0.14)" },
    transition:  { type: "spring", stiffness: 300, damping: 25 },
  } : {};

  return (
    <Comp
      className={cn(
        "rounded-3xl border border-surface-200 transition-all duration-200",
        glass ? "glass" : "bg-white",
        elevated ? "shadow-soft-md" : "shadow-soft-sm",
        hover && "cursor-pointer",
        !noPadding && "p-6",
        className
      )}
      {...motionProps}
      {...(props as any)}
    >
      {children}
    </Comp>
  );
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-bold text-surface-900", className)} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-surface-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 mt-4 border-t border-surface-100", className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
