import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillBloom | AI-Powered Micro-Learning That Grows With You",
  description: "Plant your learning seeds today, harvest knowledge tomorrow. SkillBloom uses AI to create personalized micro-lessons that grow with you like a beautiful garden.",
  keywords: ["learning", "AI", "education", "micro-learning", "skills", "growth"],
  authors: [{ name: "SkillBloom Team" }],
  openGraph: {
    title: "SkillBloom | AI-Powered Micro-Learning",
    description: "Plant your learning seeds today, harvest knowledge tomorrow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="gradient-bg" />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

