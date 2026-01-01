import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // S'applique à tous les robots (Google, etc.)
      allow: "/", // Autorise l'indexation de tout le site par défaut
      disallow: [
        "/admin", // On cache l'interface d'administration
        "/dashboard", // On cache le tableau de bord privé des vendeurs/clients
        "/profile", // On cache les données personnelles
        "/cart", // On cache le panier
        "/checkout", // On cache la page de paiement
        "/lib/api", // On cache tes routes API internes
      ],
    },
    // Remplace par l'URL réelle de ton site quand elle sera en ligne
    sitemap: "https://www.noboutik.com/sitemap.xml",
  };
}
