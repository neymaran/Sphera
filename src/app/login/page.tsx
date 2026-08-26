"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/components/ui";


export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-200/40 blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2.5 group">
            <div className="w-16 h-16 rounded-3xl bg-white border border-surface-200 shadow-soft-md flex items-center justify-center group-hover:scale-105 transition-transform p-3">
              <img src="/naryen-logo.png" alt="Naryen Tecnologia Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-black text-surface-900">Sphera</h1>
          </Link>
          <p className="text-surface-400 text-xs font-semibold uppercase tracking-wider mt-1 flex items-center justify-center gap-1.5">
            <span>by</span>
            <span className="font-bold text-surface-700">Naryen Tecnologia</span>
          </p>
        </div>

        {/* Mode Tab Toggle */}
        <div className="bg-surface-100 p-1 rounded-2xl flex mb-8">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors z-10"
            >
              {mode === m && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-soft-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${mode === m ? "text-primary-700" : "text-surface-400"}`}>
                {m === "login" ? "Entrar" : "Criar conta"}
              </span>
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-4xl shadow-soft-lg border border-surface-100 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-xl font-bold text-surface-900 mb-1">
                {isLogin ? "Bem-vindo de volta 👋" : "Criar nova conta ✨"}
              </h2>
              <p className="text-sm text-surface-400 mb-7">
                {isLogin
                  ? "Acesse o painel da sua produtora."
                  : "Configure sua produtora em minutos."}
              </p>

              <form className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-surface-500">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none">
                      <Mail size={17} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="voce@exemplo.com"
                      className="w-full h-12 pl-10 pr-4 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-surface-500">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none">
                      <Lock size={17} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full h-12 pl-10 pr-12 bg-surface-50 border-2 border-surface-200 rounded-2xl text-sm font-medium text-surface-900 placeholder:text-surface-300 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {searchParams?.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 font-medium"
                  >
                    {searchParams.message}
                  </motion.p>
                )}

                {/* Submit */}
                <div className="pt-2 space-y-3">
                  <AnimatePresence mode="wait">
                    {isLogin ? (
                      <motion.div
                        key="login-form-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <SubmitButton
                          loadingText="Entrando..."
                          rightIcon={<ArrowRight size={18} />}
                        >
                          Entrar na conta
                        </SubmitButton>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signup-form-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <SubmitButton
                          loadingText="Criando conta..."
                          leftIcon={<Sparkles size={18} />}
                        >
                          Criar minha conta
                        </SubmitButton>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => setMode(isLogin ? "signup" : "login")}
                    className="w-full text-sm text-surface-400 hover:text-primary-600 font-medium transition-colors py-2"
                  >
                    {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
