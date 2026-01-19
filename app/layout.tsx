import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Job Radar | Know Before It's Too Late",
  description:
    "Monitor AI developments and get personalized alerts when your job is at risk. Stay ahead of automation with AI Job Radar.",
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    other: {
      'impact-site-verification': '31655d38-a6bc-47e7-909c-8d1087b051ef',
    },
  },
  keywords: [
    "AI job risk",
    "automation",
    "career protection",
    "job security",
    "AI monitoring",
    "upskilling",
  ],
  authors: [{ name: "AI Job Radar" }],
  openGraph: {
    title: "AI Job Radar | Know Before It's Too Late",
    description:
      "Monitor AI developments and get personalized alerts when your job is at risk.",
    type: "website",
    locale: "en_US",
    siteName: "AI Job Radar",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Job Radar | Know Before It's Too Late",
    description:
      "Monitor AI developments and get personalized alerts when your job is at risk.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
