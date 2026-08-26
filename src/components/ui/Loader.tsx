/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";

/**
 * SpheraLoader — Animação de carregamento premium usada em transições de página,
 * loading de dados iniciais e splash screens.
 *
 * Props:
 * - text:    Texto opcional a exibir embaixo da animação
 * - variant: "page" (fullscreen) | "inline" (inline, menor)
 */
interface SpheraLoaderProps {
  text?:    string;
  variant?: "page" | "inline";
}

export function SpheraLoader({ text = "Carregando...", variant = "inline" }: SpheraLoaderProps) {
  const isPage = variant === "page";

  return (
    <div
      className={
        isPage
          ? "fixed inset-0 z-[999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
          : "flex flex-col items-center justify-center gap-5 py-16 w-full"
      }
    >
      {/* Spheres orbit animation */}
      <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
        {/* Core */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-primary-600 to-primary-400"
          style={{ width: 24, height: 24 }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Pulse ring */}
        <motion.div
          className="absolute rounded-full border-2 border-primary-400"
          style={{ width: 24, height: 24 }}
          animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
        />

        {/* Orbit 1 */}
        <motion.div
          className="absolute"
          style={{ width: 64, height: 64 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-300"
            style={{ width: 10, height: 10 }}
          />
        </motion.div>

        {/* Orbit 2 */}
        <motion.div
          className="absolute"
          style={{ width: 48, height: 48 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500"
            style={{ width: 8, height: 8 }}
          />
        </motion.div>
      </div>

      {/* Text */}
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <span className="font-bold text-lg text-surface-900 tracking-tight">
          <span className="text-gradient">Sphera</span>
        </span>
        {text && (
          <span className="text-sm text-surface-400 font-medium">{text}</span>
        )}
      </motion.div>
    </div>
  );
}

/**
 * SpheraSplash — Tela de splash para carregamento inicial do sistema.
 * Usada no início da sessão ou em loads pesados.
 */
export function SpheraSplash({ onFinish }: { onFinish?: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.8 }}
    >
      {/* Floating spheres background */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          style={{
            width:  `${60 + i * 40}px`,
            height: `${60 + i * 40}px`,
            left:   `${10 + i * 15}%`,
            top:    `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            y:       [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat:   Infinity,
            delay:    i * 0.3,
            ease:     "easeInOut",
          }}
        />
      ))}

      {/* Logo */}
      <motion.div
        className="relative flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      >
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-[28px] bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center shadow-soft-xl p-3.5">
            <img src="/naryen-logo.png" alt="Naryen Tecnologia Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Name */}
        <motion.h1
          className="text-4xl font-black text-white tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Sphera
        </motion.h1>
        <motion.p
          className="text-primary-200 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          by Naryen Tecnologia
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="w-40 h-1 rounded-full bg-white/10 overflow-hidden mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
