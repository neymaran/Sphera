import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sphera — Plataforma de Ingressos",
  description: "A plataforma SaaS de venda de ingressos da Naryen Tecnologia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="font-sans bg-surface-50 text-foreground antialiased">
        <NavigationProgressBar />
        {children}
      </body>
    </html>
  );
}
