"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Monitor route changes to stop loading
  useEffect(() => {
    setLoading(false);
    setProgress(100);
    const timer = setTimeout(() => setProgress(0), 400);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept anchor clicks to trigger immediate loading bar
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (anchor && anchor.href && anchor.target !== "_blank") {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Only trigger if navigating to a different internal page
        if (
          targetUrl.origin === currentUrl.origin &&
          (targetUrl.pathname !== currentUrl.pathname ||
            targetUrl.search !== currentUrl.search)
        ) {
          setLoading(true);
          setProgress(30);

          // Slowly increment to simulate progress
          const interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 85) {
                clearInterval(interval);
                return 85;
              }
              return prev + 12;
            });
          }, 150);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
      {/* Top progress bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-sky-400 shadow-glow"
        initial={{ width: "0%", opacity: 1 }}
        animate={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
        transition={{
          width: { duration: 0.2, ease: "easeOut" },
          opacity: { duration: 0.3, delay: progress === 100 ? 0.1 : 0 },
        }}
      />

      {/* Floating sphere indicator on right corner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed top-3 right-4 z-[99999] flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-surface-200 px-3.5 py-1.5 rounded-full shadow-soft-md"
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
            </div>
            <span className="text-xs font-semibold text-surface-700">Carregando...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
