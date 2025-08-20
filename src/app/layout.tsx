import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/personalization/theme-provider";
import { ToastProvider } from "@/shadcn/ui/toast-provider";
import logo from "@/assets/favicon.ico"

import "@/styles/globals.css";
import Navbar from "@/components/navigation/navbar";
import LayoutWrapper from "@/components/navigation/layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leafin Things",
  icons:{
    icon:logo.src
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <Navbar />
            <LayoutWrapper>
                {children}
            </LayoutWrapper>
          </ToastProvider>
        </ThemeProvider>
      </body>

    </html>
  );
}
