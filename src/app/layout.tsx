import type { Metadata, Viewport } from "next";
import { Sora, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./lib/useFCMnotification";
import PWAInstallBanner from "./components/features/PWAInstallBanner";
import { GoogleTagManager } from "@next/third-parties/google";

// ✅ Sora : titres & identité de marque (logo, hero, CTA)
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// ✅ Inter : texte courant / UI (déjà optimisée pour les écrans)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // ✅ Améliore le chargement des polices
});

// 🎯 SEO Optimisé pour noBoutik
export const metadata: Metadata = {
  title: {
    default: "NoBoutik | Achetez et vendez en toute simplicité",
    template: "%s | NoBoutik",
  },
  description:
    "La plateforme de mise en relation entre vendeurs locaux et clients. Trouvez les meilleurs produits ou ouvrez votre boutique gratuitement sur NoBoutik.",
  keywords: [
    "marketplace",
    "vente en ligne",
    "boutique locale",
    "ecommerce",
    "NoBoutik",
    "achat local",
    "vendeur proche",
  ],
  authors: [{ name: "NoBoutik" }],
  creator: "NoBoutik",
  publisher: "NoBoutik",
  metadataBase: new URL("https://noboutik.vercel.app"), 
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NoBoutik | Achetez et vendez en toute simplicité",
    description: "Connectez-vous avec les meilleurs vendeurs de votre région.",
    type: "website",
    locale: "fr_FR",
    siteName: "NoBoutik",
    images: [
      {
        url: "/images/bj.png", // ✅ Image pour les partages sociaux
        width: 1200,
        height: 630,
        alt: "NoBoutik - Marketplace locale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoBoutik | Achetez et vendez en toute simplicité",
    description: "Connectez-vous avec les meilleurs vendeurs de votre région.",
    images: ["/images/android-chrome-512x512.png"],
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
  verification: {
    google: "82g5U_dAM6cNpBMDgsZBcwitt7TtJdoEaveCMTgaulM", // ✅ Ajoute cette ligne
  },

  // ✅ Pour PWA
  applicationName: "NoBoutik",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NoBoutik",
  },
  formatDetection: {
    telephone: false,
  },
  // ✅ Icons - Next.js les gère automatiquement si tu as app/icon.png
  icons: {
    icon: "/images/android-chrome-512x512.png",
    apple: "/images/apple-touch-icon.png",
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
      <GoogleTagManager gtmId="GTM-PZSL8J8F" />
      <body
        className={`${sora.variable} ${inter.variable} ${geistMono.variable} antialiased`}
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
