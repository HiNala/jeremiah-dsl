import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { bodyText } from "@/components/fonts";
import BrandAndNav from "@/components/BrandAndNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jeremiah Miller",
  description: "Singer, songwriter, and street performer.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bodyText.className} antialiased bg-background text-foreground`}>
        <BrandAndNav />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
