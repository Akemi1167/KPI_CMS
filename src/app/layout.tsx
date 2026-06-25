import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PreferencesScript } from "@/components/admin/preferences-script";
import { AuthProvider } from "@/features/auth/hooks/useAuth";
import { getServerPreferences } from "@/i18n/server";
import { PreferencesProvider } from "@/providers/preferences-provider";
import { getThemeClassName } from "@/lib/preferences";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "KPI Management CMS",
  description: "Hệ thống quản lý KPI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, theme } = await getServerPreferences();
  const themeClass = getThemeClassName(theme);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased${themeClass ? ` ${themeClass}` : ""}`}
    >
      <head>
        <PreferencesScript />
      </head>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <PreferencesProvider initialLocale={locale} initialTheme={theme}>
            {children}
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
