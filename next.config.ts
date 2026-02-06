/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  // 🔧 Exclure les manifests problématiques
  buildExcludes: [/app-build-manifest\.json$/, /middleware-manifest\.json$/],

  // 🔧 Cache uniquement les ressources de votre domaine
  publicExcludes: ["!robots.txt", "!sitemap.xml"],

  // 🔧 Configuration cache réseau
  runtimeCaching: [
    // Cache des API calls vers Railway
    {
      urlPattern: /^https:\/\/belidjo-production\.up\.railway\.app\/api\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes pour l'API
        },
      },
    },
    // Cache des images
    {
      urlPattern: /^https:\/\/(ik\.imagekit\.io|images\.unsplash\.com)\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    // Cache des ressources statiques Vercel
    {
      urlPattern: /^https:\/\/.*\.vercel\.app\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
        },
      },
    },
    // Autres requêtes
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "https-calls",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 150,
          maxAgeSeconds: 24 * 60 * 60, // 1 jour
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/hxzzd0xgi/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
