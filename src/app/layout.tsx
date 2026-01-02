import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO Optimisé pour noBoutik
export const metadata: Metadata = {
  title: {
    default: "noBoutik | Achetez et vendez en toute simplicité",
    template: "%s | noBoutik", // Si une page s'appelle "iPhone 15", le titre sera "iPhone 15 | noBoutik"
  },
  description:
    "La plateforme de mise en relation entre vendeurs locaux et clients. Trouvez les meilleurs produits ou ouvrez votre boutique gratuitement sur noBoutik.",
  keywords: [
    "marketplace",
    "vente en ligne",
    "boutique locale",
    "ecommerce",
    "noBoutik",
  ],
  metadataBase: new URL("https://votre-domaine.com"), // Remplace par ton vrai domaine plus tard
  openGraph: {
    title: "noBoutik",
    description: "Connectez-vous avec les meilleurs vendeurs de votre région.",
    type: "website",
    locale: "fr_FR",
    siteName: "noBoutik",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      {" "}
      {/* ✅ Changé en "fr" si ton public est francophone */}
      <head>
        {/* Les fonts via <link> sont acceptables, mais Next.js préfère l'optimisation via next/font comme tu l'as fait avec Geist */}
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

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
