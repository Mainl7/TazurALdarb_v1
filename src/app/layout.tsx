import type { Metadata } from "next";
import "./globals.css";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "جمعية تآزر | بطاقات تهنئة إسلامية مخصصة",
    template: "%s | جمعية تآزر لرعاية الأيتام",
  },
  description:
    "منصة بطاقات التهنئة الإسلامية المخصصة من جمعية تآزر لرعاية الأيتام بمحافظة الدرب. أنشئ بطاقتك بمناسبة عيد الفطر، عيد الأضحى، رمضان، ورأس السنة الهجرية.",
  keywords: [
    "بطاقات تهنئة إسلامية",
    "عيد الفطر",
    "عيد الأضحى",
    "رمضان",
    "جمعية تآزر",
    "رعاية الأيتام",
    "الدرب",
  ],
  authors: [{ name: "جمعية تآزر لرعاية الأيتام" }],
  creator: "جمعية تآزر",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "جمعية تآزر",
    title: "جمعية تآزر | بطاقات تهنئة إسلامية مخصصة",
    description:
      "أنشئ بطاقتك الإسلامية المخصصة باسمك وشاركها مع أحبائك",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "جمعية تآزر - بطاقات التهنئة الإسلامية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جمعية تآزر | بطاقات تهنئة إسلامية",
    description: "بطاقات تهنئة إسلامية مخصصة باسمك",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Scheherazade+New:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#0F6B3F" />
      </head>
      <body className="antialiased">
        <TRPCReactProvider>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
