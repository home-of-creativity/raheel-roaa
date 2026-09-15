import "../globals.css";
import {
  Cormorant_Garamond,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  Noto_Kufi_Arabic,
} from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { ScrollProgress } from "@/src/components/ui/ScrollProgress";
import { WhatsAppFab } from "@/src/components/ui/WhatsAppFab";
import { travelAgencyJsonLd } from "@/src/lib/jsonLd";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-kufi",
  display: "swap",
});

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://raheel-roaa.com";

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "ar" ? baseUrl : `${baseUrl}/en`,
      languages: {
        ar: baseUrl,
        en: `${baseUrl}/en`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "ar" ? "ar_AR" : "en_US",
      type: "website",
      images: [{ url: `${baseUrl}/media/hero-beyond-borders.png`, width: 1400, height: 800 }],
    },
    icons: {
      icon: "/media/logo.png",
      apple: "/media/logo.png",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "a11y" });
  const dir = locale === "ar" ? "rtl" : "ltr";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://raheel-roaa.com";
  const jsonLd = travelAgencyJsonLd(locale === "ar" ? baseUrl : `${baseUrl}/en`);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${ibmPlex.variable} ${ibmPlexArabic.variable} ${notoKufiArabic.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <a
            href="#site-main"
            className="skip-link rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink"
          >
            {t("skipToContent")}
          </a>
          <ScrollProgress />
          <Header />
          <main id="site-main">{children}</main>
          <Footer />
          <WhatsAppFab />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
