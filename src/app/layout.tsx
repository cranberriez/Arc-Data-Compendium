import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeLayout from "@/components/ThemeLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARC Data Compendium",
  description: "A comprehensive data compendium for ARC game items and gear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeLayout>{children}</ThemeLayout>
    </html>
  );
}
