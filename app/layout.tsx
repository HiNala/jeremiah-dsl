import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { bodyText } from "@/components/fonts";
import { typographyConfig } from "@/config/typography";
import BrandAndNav from "@/components/BrandAndNav";
import SiteFooter from "@/components/layout/SiteFooter";

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
  const bodyFontClass = typographyConfig.bodyFont === "inter" ? inter.className : bodyText.className;
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bodyFontClass} antialiased bg-[#0B0E12] text-[#EAEAEA]`}>
        <BrandAndNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
