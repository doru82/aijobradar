import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Job Radar | Is AI Coming For Your Job?",
  description:
    "Get your personalized AI risk score in 60 seconds. Know the threats, build the skills, stay ahead of automation. Free career risk assessment.",
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    other: {
      "impact-site-verification": "31655d38-a6bc-47e7-909c-8d1087b051ef",
    },
  },
  keywords: [
    "AI job risk",
    "will AI take my job",
    "AI automation risk",
    "career protection",
    "job security AI",
    "AI job replacement",
    "future proof career",
    "upskilling for AI",
    "AI career coach",
    "job automation calculator",
  ],
  authors: [{ name: "AI Job Radar" }],
  creator: "AI Job Radar",
  publisher: "AI Job Radar",
  metadataBase: new URL("https://aijobradar.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Job Radar | Is AI Coming For Your Job?",
    description:
      "Get your personalized AI risk score in 60 seconds. Free career risk assessment powered by AI.",
    type: "website",
    locale: "en_US",
    url: "https://aijobradar.io",
    siteName: "AI Job Radar",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Job Radar - Know your AI automation risk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Job Radar | Is AI Coming For Your Job?",
    description:
      "Get your personalized AI risk score in 60 seconds. Free career risk assessment.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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