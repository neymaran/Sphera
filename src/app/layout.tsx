import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { Suspense } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sphera — Plataforma de Ingressos",
  description: "A plataforma SaaS de venda de ingressos da Naryen Tecnologia",
  icons: {
    icon: "/naryen-logo.png",
    shortcut: "/naryen-logo.png",
    apple: "/naryen-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="font-sans bg-surface-50 text-foreground antialiased">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
