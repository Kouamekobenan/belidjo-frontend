import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* 🧩 Favicon classiques */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/images/favicon.ico" />

        {/* 🍎 Icône Apple (iPhone/iPad) */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />

        {/* 📱 PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* 🎨 Couleurs du thème */}
        <meta name="theme-color" content="#000000" />
        <meta name="background-color" content="#ffffff" />

        {/* 🏷️ Informations générales */}
        <meta name="application-name" content="NoBoutik" />
        <meta name="apple-mobile-web-app-title" content="NoBoutik" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* SEO & description */}
        <meta
          name="description"
          content="NoBoutik - Achetez et vendez en toute simplicité. La plateforme de mise en relation entre vendeurs locaux et clients."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
