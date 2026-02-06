import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./lib/useFCMnotification";
import PWAInstallBanner from "./components/features/PWAInstallBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // ✅ Améliore le chargement des polices
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // ✅ Améliore le chargement des polices
});

// 🎯 SEO Optimisé pour noBoutik
export const metadata: Metadata = {
  title: {
    default: "noBoutik | Achetez et vendez en toute simplicité",
    template: "%s | noBoutik",
  },
  description:
    "La plateforme de mise en relation entre vendeurs locaux et clients. Trouvez les meilleurs produits ou ouvrez votre boutique gratuitement sur noBoutik.",
  keywords: [
    "marketplace",
    "vente en ligne",
    "boutique locale",
    "ecommerce",
    "noBoutik",
    "achat local",
    "vendeur proche",
  ],
  authors: [{ name: "noBoutik" }],
  creator: "noBoutik",
  publisher: "noBoutik",
  metadataBase: new URL("https://belidjo-frontend.vercel.app"), // ⚠️ Remplace par ton vrai domaine en production
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "noBoutik | Achetez et vendez en toute simplicité",
    description: "Connectez-vous avec les meilleurs vendeurs de votre région.",
    type: "website",
    locale: "fr_FR",
    siteName: "noBoutik",
    images: [
      {
        url: "/logo.png", // ✅ Image pour les partages sociaux
        width: 1200,
        height: 630,
        alt: "noBoutik - Marketplace locale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "noBoutik | Achetez et vendez en toute simplicité",
    description: "Connectez-vous avec les meilleurs vendeurs de votre région.",
    images: ["/logo.png"],
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
  // ✅ Pour PWA
  applicationName: "noBoutik",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "noBoutik",
  },
  formatDetection: {
    telephone: false,
  },
  // ✅ Icons - Next.js les gère automatiquement si tu as app/icon.png
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // ✅ Changé de 1 à 5 pour l'accessibilité (permet le zoom)
  userScalable: true, // ✅ Permet le zoom (accessibilité)
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* ✅ Les polices Google sont déjà gérées par next/font, pas besoin de les recharger */}
        {/* Si tu veux vraiment Roboto, Poppins, Inter, décommente ci-dessous : */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* ✅ Apple Touch Icon (déjà géré par metadata.icons, mais on peut le laisser) */}
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />

        {/* ✅ Meta theme-color (déjà dans viewport, mais certains navigateurs le préfèrent ici) */}
        <meta name="theme-color" content="#000000" />

        {/* ✅ Meta pour iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="noBoutik" />

        {/* ✅ Meta pour Windows */}
        <meta name="msapplication-TileColor" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NotificationProvider>
            {children}
            <PWAInstallBanner style="premium" />

            {/* ✅ Toaster pour les notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                // Options globales pour tous les toasts
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
