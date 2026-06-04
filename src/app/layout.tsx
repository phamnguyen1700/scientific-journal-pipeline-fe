import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import { LayoutContent } from "@/components/common";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scientific Journal Trend Tracking",
  description: "Track scientific journal publication trends and research topics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">
        <AppProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppProvider>
      </body>
    </html>
  );
}
