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
  Users,
  Share2,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { CustomerRepository } from "@/app/customer/infrastructure/customer-repository.impl";
import { CreateCustomerUseCase } from "@/app/customer/application/usecases/create-customer.usecase";
import { useAuth } from "@/app/context/AuthContext";
import { CustomerMapper } from "@/app/customer/domain/mapper/customer.mapper";
import toast from "react-hot-toast";
import VendorProducts from "../components/GetProduct";
import { photoCouv } from "@/app/lib/globals.type";
import { NotificationRepository } from "@/app/notification/infrastructure/notification.repository";
import { CreateNotificationUseCase } from "@/app/notification/application/usecases/create-notification.usecase";
import { TypeNotification } from "@/app/notification/domain/enums/type-notification";
import { FindAllCustomerUseCase } from "@/app/customer/application/usecases/find-all-customer.usecase";
import { Customer } from "@/app/customer/domain/entities/customer.entity";

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

// --- COMPOSANT : Bouton d'Édition de Bannière ---
const customerRep = new CustomerRepository(new CustomerMapper());
const findAllCustomerUseCase = new FindAllCustomerUseCase(customerRep);
const notificationRepo = new NotificationRepository();
const notificationService = new CreateNotificationUseCase(notificationRepo);

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
    event: React.ChangeEvent<HTMLInputElement>,
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
        className="absolute top-4 right-4 sm:top-6 sm:right-6 
    bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg 
    transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed z-20
    w-12 h-12 rounded-full flex items-center justify-center
    sm:w-auto cursor-pointer sm:h-auto sm:px-4 sm:py-2.5 sm:rounded-xl sm:border sm:border-slate-200/50
    hover:bg-white hover:scale-105 active:scale-95"
        aria-label="Modifier la bannière"
      >
        <div className="flex items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                En cours...
              </span>
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                Modifier la bannière
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
                    Ratio recommandé : 16:9 (1200x630px)
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
                  Choisir
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
      toast.success("Lien copié ! Partagez-le à vos amis 🎉");
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de la copie: ", err);
      toast.error("Erreur lors de la copie");
    }
  }, [domain]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2.5 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group shadow-sm hover:shadow-md"
      aria-label={`Copier le domaine ${domain}`}
    >
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
        {isCopied ? (
          <Check className="w-5 h-5 text-teal-600 animate-bounce" />
        ) : (
          <Share2 className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
        )}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
          {isCopied ? "Copié !" : "Partager"}
        </span>
        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
          {domain}
        </span>
      </div>
    </button>
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
      toast.success("Veuillez vous connecter pour vous abonner");
      window.location.href = "/users/ui/login";
      return;
    }
    setIsLoading(true);
    try {
      if (isSubscribed) {
        const response = await api.delete(`/customer/${customerId}`);
        if (response.status === 200) {
          setIsSubscribed(false);
          toast.success("Désabonnement réussi");
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
          toast.success("Abonnement réussi ! 🎉");
          const formData = {
            senderId: userId,
            receiverId: vendorId,
            title: "Nouvel abonné !",
            message: `Vous avez un nouvel abonné 🎉`,
            type: TypeNotification.SUBSCRIPTION,
            isRead: false,
          };
          await notificationService.execute(formData);
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de l'abonnement:", error);
      if (error.response?.status === 409) {
        toast.success("Vous êtes déjà abonné");
        setIsSubscribed(true);
      } else {
        toast.error("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => toast.error("Veuillez vous connecter")}
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
      >
        <Bell className="w-5 h-5" />
        <span>Se connecter</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        isSubscribed
          ? "bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 shadow-sm"
          : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-lg hover:shadow-xl"
      } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {isSubscribed ? (
            <BellOff className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
          <span>{isSubscribed ? "Abonné" : "S'abonner"}</span>
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
  const [vendor, setVendor] = useState<Vendor>(initialVendor);
  const [bannerUrl, setBannerUrl] = useState<string>(
    initialVendor.site?.logoUrl || photoCouv,
  );
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await findAllCustomerUseCase.execute(vendorId, 500, 1);
        setCustomers(res.data);
      } catch (error) {
        console.log("Erreur lors de la récupération des données:", error);
      }
    };
    fetchCustomers();
  }, [vendor.id]);

  const { user } = useAuth();
  const currentUserId = user?.id || null;
  const { id } = useParams();

  const handleBannerUpdate = (newImageUrl: string) => {
    setBannerUrl(newImageUrl);
    setVendor((prev) => ({
      ...prev,
      site: { ...prev.site, logoUrl: newImageUrl },
    }));
  };

  const { name, id: vendorId, site } = vendor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <VendorNavBar
        vendorName={name}
        vendorDescription={site?.description}
        vendorImage={bannerUrl}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* CARTE PROFIL PRINCIPALE */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-10 border border-slate-100">
          {/* BANNIÈRE DE COUVERTURE */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100">
            <Image
              src={bannerUrl}
              alt={`Bannière ${name}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            {/* Bouton d'édition */}
            <BannerEditButton
              vendorId={vendorId}
              siteId={site.id}
              currentUserId={currentUserId}
              vendorOwnerId={vendor.userId}
              onImageUpdate={handleBannerUpdate}
            />
          </div>
          {/* SECTION PROFIL */}
          <div className="relative px-4 sm:px-10 pb-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 sm:gap-8 -mt-20 relative z-10">
              {/* IMAGE DE PROFIL AVEC ANIMATION DE ROTATION */}
              <div className="profile-image-container group">
                <div className="relative">
                  {/* Cercle extérieur avec effet de lueur */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  {/* Container avec bordure animée */}
                  <div className="relative bg-white p-1.5 rounded-full shadow-2xl">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      {/* Image avec rotation infinie */}
                      <div className="profile-image-rotate w-full h-full">
                        <Image
                          src={bannerUrl}
                          fill
                          alt={`Logo ${name}`}
                          className="object-cover"
                          priority
                        />
                      </div>
                      {/* Overlay avec dégradé */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-transparent to-purple-500/20 pointer-events-none"></div>
                    </div>
                  </div>
                  {/* Badge vérifié */}
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              {/* INFORMATIONS ET ACTIONS */}
              <div className="flex-1 pt-6 sm:pt-8 w-full">
                {/* Nom et localisation */}
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text">
                    {name}
                  </h1>
                  {vendor.user?.cityName && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-5 h-5 text-teal-600" />
                      <span className="text-lg font-medium">
                        {vendor.user.cityName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions principales */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <SubscribeButton
                    vendorId={vendorId}
                    userId={currentUserId}
                    cityId={vendor.cityId}
                  />

                  {site?.domain && <DomainCopyButton domain={site.domain} />}

                  {/* Badge nombre d'abonnés */}
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-default">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">
                        {customers.length.toLocaleString("fr-FR")}
                      </span>
                      <span className="text-sm font-semibold text-slate-600">
                        {customers.length > 1 ? "abonnés" : "abonné"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coordonnées */}
                {(vendor.user?.email || vendor.user?.phone) && (
                  <div className="flex flex-wrap gap-4 mb-6">
                    {vendor.user?.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="font-medium">{vendor.user.email}</span>
                      </div>
                    )}
                    {vendor.user?.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="font-medium">{vendor.user.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {site?.description && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border-2 border-slate-200 shadow-sm">
                    <p className="text-slate-700 leading-relaxed text-base">
                      {site.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Listes des produits */}
        <CategoriesList vendorId={vendorId} />
        <VendorProducts vendorId={vendorId} />
        <VendorFooter name={name} site={site} user={vendor.user} />
      </div>

      <style jsx global>{`
        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .profile-image-rotate {
          animation: rotate-slow 20s linear infinite;
        }

        .profile-image-container:hover .profile-image-rotate {
          animation: rotate-slow 8s linear infinite;
        }

        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
