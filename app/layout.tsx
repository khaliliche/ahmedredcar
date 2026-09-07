import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { cookies } from 'next/headers';

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["600", "700", "800"],
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
);

// Helper function to get a value from an object using a dot-separated path.
function getByPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      obj
    );
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('ahmedredcar-lang')?.value || 'fr'

  // Import the translations module.
  const { translations } = await import('@/lib/i18n/translations');
  const t = (path: string) => {
    const value = getByPath(translations[lang as keyof typeof translations], path);
    if (typeof value !== 'string') {
      return path;
    }
    return value;
  };

  return {
    title: `${t('siteConfig.name')} | ${t('siteConfig.tagline')}`,
    description: t('metadata.description'),
    icons: {
      icon: "/favicon.ico",
      apple: "/ahmed-redcar-logo.png",
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: t('siteConfig.name'),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B0A08",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies()
  const lang = cookieStore.get('ahmedredcar-lang')?.value || 'fr'

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body className={`${archivo.variable} ${inter.variable} antialiased`}>
        <LanguageProvider>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}