"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/app/lib/api";
import VendorNavBar from "@/app/components/layout/Vendor-NavBar";
import Image from "next/image";
import CategoriesList from "@/app/categories/ui/components/FindCategory";
import { VendorFooter } from "@/app/components/layout/Vendor-Footer";
import Head from "next/head";
import {
  Copy,
  Check,
  Bell,
  BellOff,
  Loader2,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { CustomerRepository } from "@/app/customer/infrastructure/customer-repository.impl";
import { CreateCustomerUseCase } from "@/app/customer/application/usecases/create-customer.usecase";
// import { CreateCustomerDto } from "@/app/customer/application/dtos/create-customer.dto";
import { useAuth } from "@/app/context/AuthContext";
import { CustomerMapper } from "@/app/customer/domain/mapper/customer.mapper";
import toast from "react-hot-toast";
import VendorProducts from "../components/GetProduct";
import { photoCouv } from "@/app/lib/globals.type";

interface Site {
  id: string;
  vendorId: string;
  domain: string;
  description: string;
  logoUrl: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cityName: string;
}

interface Vendor {
  id: string;
  userId: string;
  name: string;
  cityId: string;
  site: Site;
  user: User;
}
const customerRepo = new CustomerRepository(new CustomerMapper());

// --- NOUVEAU COMPOSANT : Meta Tags pour Partage Social ---
interface SocialMetaTagsProps {
  vendor: Vendor;
  currentUrl: string;
}

const SocialMetaTags = ({ vendor, currentUrl }: SocialMetaTagsProps) => {
  const { name, site } = vendor;
  const title = `${name} | Boutique en ligne`;
  const description = site?.description || `Visitez la boutique de ${name}.`;

  // Utilise une URL absolue pour l'image (OBLIGATOIRE pour WhatsApp/FB)
  const imageUrl = site?.logoUrl || "https://ton-domaine.com/default-share.jpg";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      {/* WhatsApp préfère les images carrées ou 1200x630 */}
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/jpeg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};

// --- COMPOSANT : Bouton d'Édition de Bannière ---

interface BannerEditButtonProps {
  vendorId: string;
  siteId: string;
  currentUserId: string | null;
  vendorOwnerId: string;
  onImageUpdate: (newImageUrl: string) => void;
}

const BannerEditButton = ({
  siteId,
  currentUserId,
  vendorOwnerId,
  onImageUpdate,
}: BannerEditButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwner = currentUserId === vendorOwnerId;

  if (!isOwner) return null;

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);
    setShowModal(false);

    try {
      const formData = new FormData();
      formData.append("logoUrl", file);
      const response = await api.patch(`/vendor/site/${siteId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.data?.logoUrl) {
        onImageUpdate(response.data.data.logoUrl);
        toast.success("Bannière mise à jour avec succès ! 🎉");
      }
    } catch (error: any) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors de la mise à jour de la bannière");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isUploading}
        className="absolute top-4 right-4 sm:top-6 sm:left-6 
    bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg 
    transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed z-20
    w-12 h-12 rounded-full flex items-center justify-center
    sm:w-36 cursor-pointer sm:h-auto sm:px-3 sm:py-2 sm:rounded-lg sm:border sm:border-slate-200/50
    hover:bg-white hover:scale-105 active:scale-95"
        aria-label="Modifier la bannière"
      >
        <div className="flex items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
              <span className="hidden sm:inline text-xs font-medium text-slate-700">
                En cours...
              </span>
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium text-slate-700">
                Modifier
              </span>
            </>
          )}
        </div>
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">
                Modifier la bannière
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600">
                Choisissez une nouvelle image pour votre bannière de couverture.
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-dashed border-slate-300">
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600" />
                    Format : JPG, PNG, WEBP
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600" />
                    Taille max : 5MB
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600" />
                    Ratio recommandé : 16:9 (1200x630px pour partage optimal)
                  </li>
                </ul>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Choisir une image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- COMPOSANT : Bouton de Copie du Domaine ---

interface DomainCopyButtonProps {
  domain: string;
}

const DomainCopyButton = ({ domain }: DomainCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      const vendorUrl = window.location.href;
      const fullUrl = `Lien pour visiter mon site: ` + vendorUrl;
      await navigator.clipboard.writeText(fullUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de la copie: ", err);
    }
  }, [domain]);

  return (
    <div
      className="flex items-center gap-2 text-sm cursor-pointer group"
      onClick={handleCopy}
      role="button"
      aria-label={`Copier le domaine ${domain}`}
    >
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
        {isCopied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-slate-600 group-hover:text-blue-700" />
        )}
      </div>
      <span
        className={`font-medium transition-colors duration-300 ${
          isCopied
            ? "text-green-600 font-bold"
            : "text-slate-600 group-hover:text-blue-700"
        }`}
      >
        {isCopied ? "Lien Copié ! partager à vos amis👥" : domain}
      </span>
    </div>
  );
};

// --- COMPOSANT : Bouton d'Abonnement ---
interface SubscribeButtonProps {
  vendorId: string;
  userId: string | null;
  cityId: string;
}
interface CustomerType {
  id: string;
  vendorId: string;
  userId: string | null;
  cityId: string;
}

const SubscribeButton = ({ vendorId }: SubscribeButtonProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerType>();
  const { user } = useAuth();
  const userId = user?.id;
  const customerId = customer?.id;

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!userId) {
          setIsLoading(false);
          return;
        }
        const response = await api.get(`/customer/user/${userId}`);
        setCustomer(response.data.data);
        setIsSubscribed(response.data.data || false);
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSubscription();
  }, [userId, vendorId]);

  const handleSubscribe = async () => {
    if (!userId) {
      toast.success("Veuillez vous connecter pour vous abonner à ce vendeur");
      window.location.href = "/users/ui/login";
      return;
    }
    setIsLoading(true);
    try {
      if (isSubscribed) {
        const response = await api.delete(`/customer/${customerId}`);
        if (response.status === 200) {
          setIsSubscribed(false);
          toast.success("Vous n'êtes plus client de ce vendeur");
        }
      } else {
        const clientData = {
          userId: userId,
          vendorId: vendorId,
          cityId: user.cityId,
        };
        const response = await api.post("/customer", clientData);
        if (response.status === 201 || response.status === 200) {
          setIsSubscribed(true);
          toast.success("Vous êtes maintenant client de ce vendeur ! 🎉");
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de l'abonnement:", error);
      if (error.response?.status === 409) {
        toast.success("Vous êtes déjà client de ce vendeur");
        setIsSubscribed(true);
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => toast.error("Veuillez vous connecter pour vous abonner")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg group"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-white/20 group-hover:bg-white/30">
          <Bell className="w-4 h-4" />
        </div>
        <span className="font-semibold">Se connecter pour s'abonner</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
        isSubscribed
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
          : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg"
      } disabled:opacity-50 disabled:cursor-not-allowed group`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isSubscribed
                ? "bg-gray-200 group-hover:bg-gray-300"
                : "bg-white/20 group-hover:bg-white/30"
            }`}
          >
            {isSubscribed ? (
              <BellOff className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </div>
          <span className="font-semibold">
            {isSubscribed ? "Client" : "Devenir client"}
          </span>
        </>
      )}
    </button>
  );
};

// --- Composant Principal de la Page ---
export default function VendorProductsClient({
  initialVendor,
}: {
  initialVendor: Vendor;
}) {
  // On initialise le state avec les données du serveur
  const [vendor, setVendor] = useState<Vendor>(initialVendor);
  const [bannerUrl, setBannerUrl] = useState<string>(
    initialVendor.site?.logoUrl || photoCouv
  );

  const { user } = useAuth();
  const currentUserId = user?.id || null;
  const { id } = useParams();

  // Mise à jour locale si l'utilisateur change la bannière
  const handleBannerUpdate = (newImageUrl: string) => {
    setBannerUrl(newImageUrl);
    setVendor((prev) => ({
      ...prev,
      site: { ...prev.site, logoUrl: newImageUrl },
    }));
  };

  const { name, id: vendorId, site } = vendor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      <VendorNavBar
        vendorName={name}
        vendorDescription={site?.description}
        vendorImage={bannerUrl}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          {/* BANNIÈRE DE COUVERTURE */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
            <Image
              src={bannerUrl}
              alt={`Bannière ${name}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Bouton d'édition visible seulement pour le propriétaire */}
            <BannerEditButton
              vendorId={vendorId}
              siteId={site.id}
              currentUserId={currentUserId}
              vendorOwnerId={vendor.userId}
              onImageUpdate={handleBannerUpdate}
            />
          </div>

          {/* Profil et Infos */}
          <div className="relative px-4 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
              <div className="bg-white p-2 rounded-3xl shadow-md">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden">
                  <Image
                    src={bannerUrl}
                    fill
                    alt="Logo"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 pt-12">
                <h1 className="text-3xl font-bold text-slate-900">{name}</h1>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {site?.domain && <DomainCopyButton domain={site.domain} />}
                  <SubscribeButton
                    vendorId={vendorId}
                    userId={currentUserId}
                    cityId={vendor.cityId}
                  />
                </div>
              </div>
            </div>

            {site?.description && (
              <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-700">{site.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Listes des produits */}
        <CategoriesList vendorId={vendorId} />
        <VendorProducts vendorId={vendorId} />

        <VendorFooter name={name} site={site} user={vendor.user} />
      </div>
    </div>
  );
}