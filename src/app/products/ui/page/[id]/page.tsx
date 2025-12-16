"use client";

import { useParams } from "next/navigation";
import VendorProducts from "../../components/GetProduct";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/app/lib/api";
import VendorNavBar from "@/app/components/layout/Vendor-NavBar";
import Image from "next/image";
import CategoriesList from "@/app/categories/ui/components/FindCategory";
import { VendorFooter } from "@/app/components/layout/Vendor-Footer";
import { Copy, Check, Bell, BellOff, Loader2 } from "lucide-react";
import { CustomerRepository } from "@/app/customer/infrastructure/customer-repository.impl";
import { CreateCustomerUseCase } from "@/app/customer/application/usecases/create-customer.usecase";
import { CreateCustomerDto } from "@/app/customer/application/dtos/create-customer.dto";
import { useAuth } from "@/app/context/AuthContext";
import { CustomerMapper } from "@/app/customer/domain/mapper/customer.mapper";
import toast from "react-hot-toast";

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
const createCustomerUseCase = new CreateCustomerUseCase(customerRepo);

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
  userId: string | null; // ID de l'utilisateur connecté
  cityId: string; // ID de la ville du vendeur
}
interface CustomerType {
  id: string;
  vendorId: string;
  userId: string | null; // ID de l'utilisateur connecté
  cityId: string;
}

const SubscribeButton = ({ vendorId }: SubscribeButtonProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerType>();
  const { user } = useAuth();
  const userId = user?.id;
  const customerId = customer?.id;
  // Vérifier si l'utilisateur est déjà client de ce vendeur

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Vérifier si la relation client-vendeur existe déjà
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
    // Vérifier si l'utilisateur est connecté
    if (!userId) {
      toast.success("Veuillez vous connecter pour vous abonner à ce vendeur");
      // Optionnel: rediriger vers la page de connexion
      window.location.href = "/users/ui/login";
      return;
    }

    setIsLoading(true);

    try {
      if (isSubscribed) {
        // Se désabonner (supprimer la relation client)
        const response = await api.delete(`/customer/${customerId}`);

        if (response.status === 200) {
          setIsSubscribed(false);
          toast.success("Vous n'êtes plus client de ce vendeur");
        }
      } else {
        // S'abonner (créer la relation client)
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

  // Si pas connecté, afficher un bouton différent
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

export default function VendorProductsPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchVendor = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/vendor/${id}`);
        setVendor(res.data.data);
      } catch (err) {
        setError("Impossible de charger les informations du vendeur");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
    // getUserFromContext();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <VendorNavBar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
            {/* Banner Skeleton */}
            <div className="h-80 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>
            {/* Content Skeleton */}
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-slate-200 rounded-2xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-32"></div>
                  <div className="h-10 bg-slate-200 rounded w-80"></div>
                  <div className="h-4 bg-slate-200 rounded w-64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <VendorNavBar />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Vendeur introuvable
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              {error || "Ce vendeur n'existe pas ou a été supprimé"}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Destruction pour des variables plus propres
  const { name, id: vendorId, site } = vendor;
  const bannerImageUrl = site?.logoUrl || "/images/img.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      <VendorNavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Vendor Header Card avec Design Premium */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-3xl">
          {/* BANNIÈRE DE COUVERTURE */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            <Image
              src={bannerImageUrl}
              alt={`Bannière ${name}`}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            {/* Badge Premium */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-slate-800">
                  Boutique Vérifiée
                </span>
              </div>
            </div>
          </div>

          {/* Contenu Principal */}
          <div className="relative px-4 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
              {/* Logo Container */}
              <div className="flex-shrink-0 bg-white p-2 rounded-3xl shadow-sm ring-4 ring-white">
                {site?.logoUrl ? (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden">
                    <Image
                      src={bannerImageUrl}
                      fill
                      alt={`Logo ${name}`}
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Informations du vendeur */}
              <div className="flex-1 pt-12">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                    Boutique
                  </span>
                  {site?.domain && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      En ligne
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                  {name}
                </h1>

                {/* Informations supplémentaires avec bouton d'abonnement */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-600">
                  {/* Bouton de copie du domaine */}
                  {site?.domain && <DomainCopyButton domain={site.domain} />}
                  {/* NOUVEAU : Bouton d'abonnement */}
                  <SubscribeButton
                    vendorId={vendorId}
                    userId={currentUserId}
                    cityId={vendor.cityId}
                  />
                </div>

                {/* Description */}
                {site?.description && (
                  <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">
                      {site.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <CategoriesList vendorId={vendorId} />
        <VendorProducts vendorId={id as string} />
        <VendorFooter
          name={vendor.name}
          site={vendor.site}
          user={vendor.user}
        />
      </div>
    </div>
  );
}
