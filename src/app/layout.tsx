import PageLayout from "@/components/pageLayout/PageLayout";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SearchProvider } from './context/searchContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luminaria",
  description: "Your personal library",
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
        <SearchProvider>
          <PageLayout>{children}</PageLayout>
        </SearchProvider>
      </body>
    </html>
  );
}
