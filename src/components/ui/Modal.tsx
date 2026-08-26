"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Modal ────────────────────────────────────────────
interface ModalProps {
  open:        boolean;
  onClose:     () => void;
  title?:      string;
  description?: string;
  children:    React.ReactNode;
  size?:       "sm" | "md" | "lg";
  className?:  string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, size = "md", className }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            key="modal"
            className={cn(
              "fixed z-50 inset-x-4 top-[50%] mx-auto w-full rounded-4xl",
              "bg-white shadow-soft-xl border border-surface-100 p-6",
              sizeMap[size],
              className
            )}
            initial={{ opacity: 0, scale: 0.92, y: "-46%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.94, y: "-46%" }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            {(title || description) && (
              <div className="mb-5">
                <div className="flex items-start justify-between">
                  {title && (
                    <h2 className="text-xl font-bold text-surface-900">{title}</h2>
                  )}
                  <button
                    onClick={onClose}
                    className="ml-4 shrink-0 p-1.5 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                {description && (
                  <p className="mt-1 text-sm text-surface-400">{description}</p>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Bottom Sheet (mobile-style) ──────────────────────
interface BottomSheetProps {
  open:      boolean;
  onClose:   () => void;
  title?:    string;
  children:  React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bs-backdrop"
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            key="bs-sheet"
            className={cn(
              "fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-4xl shadow-soft-xl border-t border-surface-100",
              "max-h-[90dvh] overflow-y-auto p-6 pb-safe",
              className
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
          >
            {/* Handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-surface-200" />

            {title && (
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-surface-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
