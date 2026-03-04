import { MetadataRoute } from "next";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://noboutik.vercel.app"; // Remplacez par votre vrai domaine

  // 1. Vos pages statiques
  const staticPages = [
    "",
    "/vendor",
    "/users/ui/login",
    "/users/ui/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  }));
  // 2. Vos pages dynamiques (Exemple pour les boutiques)
  // const shops = await getShops()
  const shopPages = [].map((shop: any) => ({
    url: `${baseUrl}/admin/ui/${shop.slug}`,
    lastModified: new Date(shop.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Vos pages produits pour les vendeurs (Exemple pour les produits)
  // const products = await getProducts()
  const productPages = [].map((vendor: any) => ({
    url: `${baseUrl}/vendor/ui/produits/${vendor.id}`,
    lastModified: new Date(vendor.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...shopPages, ...productPages];
}
