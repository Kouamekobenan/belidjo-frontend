// app/products/ui/page/[id]/page.tsx
import { Metadata } from "next";
import VendorProductsPage from "../PageClient";

async function getVendor(id: string) {
  const res = await fetch(
    `https://belidjo-production.up.railway.app/vendor/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  return res.json();
}

// ✅ Correction 1 : params est une Promise ici
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params; // 👈 On attend l'ID
  const data = await getVendor(id);
  const vendor = data?.data;

  if (!vendor) return { title: "Boutique non trouvée" };

  const title = `${vendor.name} - Boutique en ligne`;
  const description =
    vendor.site?.description || `Découvrez les produits de ${vendor.name}`;
  const imageUrl =
    vendor.site?.logoUrl || "https://votre-site.com/default-banner.jpg";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://belidjo-frontend.vercel.app/products/ui/page/${vendor.id}`,
      siteName: "Votre Plateforme Noboutik",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Logo de ${vendor.name}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

// ✅ Correction 2 : params est une Promise ici aussi
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 👈 On attend l'ID
  const data = await getVendor(id);

  if (!data?.data) return <div>Vendeur introuvable</div>;

  return <VendorProductsPage initialVendor={data.data} />;
}
