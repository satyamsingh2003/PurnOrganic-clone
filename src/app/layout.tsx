import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper/LayoutWrapper";
import Providers from "@/components/Providers";

import { sql } from "@/lib/db";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await sql`SELECT key, value FROM settings`;
    const siteName = settings.find(s => s.key === 'site_name')?.value || "Purn Organic";
    const tagline = settings.find(s => s.key === 'tagline')?.value || "100% Organic Farm Products";
    
    const metaTitle = settings.find(s => s.key === 'meta_title')?.value || `${siteName} - ${tagline}`;
    const metaDesc = settings.find(s => s.key === 'meta_description')?.value || "From naturally grown rice to stone-ground flours, bring home wholesome nutrition, authentic taste, and the goodness of chemical-free farming.";
    const metaKw = settings.find(s => s.key === 'meta_keywords')?.value || "organic, farm products, pure";
    const faviconUrl = settings.find(s => s.key === 'favicon')?.value || "/favicon.png";

    return {
      title: metaTitle,
      description: metaDesc,
      keywords: metaKw,
      icons: { icon: faviconUrl }
    };
  } catch (error) {
    return {
      title: "Purn Organic - 100% Organic Farm Products",
      description: "From naturally grown rice to stone-ground flours, bring home wholesome nutrition, authentic taste, and the goodness of chemical-free farming.",
      icons: { icon: '/favicon.png' }
    };
  }
}

import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settingsMap: Record<string, string> = {};
  try {
    const settings = await sql`SELECT key, value FROM settings`;
    settings.forEach(s => { settingsMap[s.key] = s.value; });
  } catch (e) {
    console.error("Failed to fetch settings for layout:", e);
  }

  return (
    <html lang="en">
      <body className={inter.variable}>
        {settingsMap.google_analytics_id && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${settingsMap.google_analytics_id}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settingsMap.google_analytics_id}');
              `}
            </Script>
          </>
        )}
        <NextTopLoader color="var(--primary-color)" showSpinner={false} />
        <Providers settings={settingsMap}>
          <LayoutWrapper settings={settingsMap}>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
