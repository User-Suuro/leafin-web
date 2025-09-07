import type { Metadata } from "next";
import { ThemeProvider } from "@/components/pages/root/personalization/theme-provider";
import { ToastProvider } from "@/components/shadcn/ui/toast-provider";
import logo from "@/assets/favicon.ico";

import { Cormorant_Garamond } from "next/font/google";
import { Luckiest_Guy } from "next/font/google";
import { Poppins } from "next/font/google";

import "@/styles/globals.css";
import Navbar from "@/components/pages/root/navigation/navbar";
import LayoutWrapper from "@/components/pages/root/navigation/nav-layout-wrapper";
import PageTransition from "@/components/pages/root/loading/page-transition";
import TopLoader from "@/components/pages/root/loading/TopLoader";

const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400", // only available weight
  variable: "--font-luckiest",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"], // semibold
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Leafin Things",
  icons: {
    icon: logo.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} 
                        ${luckiestGuy.variable} 
                        ${cormorant.variable} 
                        scrollbar-gutter-stable scroll-smooth`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <TopLoader />
            <Navbar />
            <PageTransition>
              <LayoutWrapper>{children}</LayoutWrapper>
            </PageTransition>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
