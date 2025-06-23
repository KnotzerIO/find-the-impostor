import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find the Impostor",
  description:
    "A multiplayer word association party game powered by AI. Find the impostors who don’t know the secret word.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {process.env.NODE_ENV === "production" &&
        process.env.UMAMI_SCRIPT_URL &&
        process.env.UMAMI_WEBSITE_ID && (
          <Script
            async
            src={process.env.UMAMI_SCRIPT_URL}
            data-website-id={process.env.UMAMI_WEBSITE_ID}
          />
        )}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <NextIntlClientProvider> {children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
