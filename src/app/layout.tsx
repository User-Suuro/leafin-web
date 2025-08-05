import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from '@/components/themes/provider';
import { UserPrefsSettings } from '@/components/themes/interface';

import "@/styles/globals.css";
import Navbar from "@/components/navbar";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ThemeProvider
                          defaultTheme="system"
                          defaultColorTheme="default"
                      >   

            <Navbar />

            <main className="flex-1">
                    {children}
            </main>

            <div className="fixed right-10 bottom-10">
                <UserPrefsSettings />
            </div>

        </ThemeProvider>
      </body>
    </html>
  );
}
