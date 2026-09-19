"use client";

import React, { useState, useCallback } from "react";
import {
  Copy,
  Check,
  Share2,
  ExternalLink,
  QrCode,
  Settings,
  Globe,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Download,
  Store,
  CreditCard,
  Clock,
  Bell,
  ShieldCheck,
  Lock,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

import VendorProfileSettings from "./VendorProfileSettings";
import VendorPaymentSettings from "./VendorPaymentSettings";
import VendorHoursSettings from "./VendorHoursSettings";

interface IvendorProfile {
  id?: string;
  name?: string;
  logoUrl?: string;
}

interface ParamVendorProps {
  vendorProfile?: IvendorProfile;
}

type TabType = "profile" | "payments" | "hours" | "share" | "notifications";

export default function ParamVendor({ vendorProfile }: ParamVendorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    whatsappOrderAlerts: true,
    emailOrderAlerts: true,
    lowStockAlerts: true,
  });

  const shopUrl = typeof window !== "undefined"
    ? `${window.location.origin}/products/ui/page/${vendorProfile?.id}`
    : "#";

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(true);
      toast.success("Lien de votre boutique copié dans le presse-papier !");
      setTimeout(() => setCopiedUrl(false), 3000);
    } catch (err) {
      console.error("Erreur copie:", err);
    }
  }, []);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Visitez ${vendorProfile?.name || "notre boutique"}`,
          text: `Découvrez ma boutique en ligne sur NoBoutik !`,
          url: shopUrl,
        });
      } catch (err) {
        console.error("Erreur partage:", err);
      }
    } else {
      handleCopy(shopUrl);
    }
  }, [shopUrl, vendorProfile?.name, handleCopy]);

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Bonjour ! Découvrez ma boutique en ligne ${vendorProfile?.name || ""} sur NoBoutik : ${shopUrl}`
      )}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shopUrl)}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shopUrl
      )}&text=${encodeURIComponent(`Découvrez ${vendorProfile?.name || "ma boutique"} sur NoBoutik !`)}`,
      "_blank"
    );
  };

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      `Découvrez ${vendorProfile?.name || "ma boutique"}`
    )}&body=${encodeURIComponent(`Visitez ma boutique en ligne : ${shopUrl}`)}`;
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    shopUrl
  )}`;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ========================================================================= */}
        {/* EN-TÊTE DE LA PAGE DES PARAMÈTRES */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 shrink-0">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Paramètres de la Boutique
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Configurez l&apos;identité, les retraits Mobile Money et la sécurité de votre commerce
              </p>
            </div>
          </div>

          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-green-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md shrink-0"
          >
            <Share2 className="w-4 h-4" />
            <span>Partager ma boutique</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* BARRE D'ONGLETS INTELLIGENTE */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-3xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "profile"
                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Profil Boutique</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "payments"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Paiements Mobile Money</span>
          </button>

          <button
            onClick={() => setActiveTab("hours")}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "hours"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Horaires & Livraison</span>
          </button>

          <button
            onClick={() => setActiveTab("share")}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "share"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Partage & QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "notifications"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications & Sécurité</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* CONTENU DES ONGLETS */}
        {/* ========================================================================= */}
        <div className="animate-in fade-in duration-300">
          
          {/* 1. PROFIL BOUTIQUE */}
          {activeTab === "profile" && <VendorProfileSettings initialData={vendorProfile} />}

          {/* 2. PAIEMENTS & MOBILE MONEY */}
          {activeTab === "payments" && <VendorPaymentSettings />}

          {/* 3. HORAIRES & LIVRAISON */}
          {activeTab === "hours" && <VendorHoursSettings />}

          {/* 4. PARTAGE & QR CODE */}
          {activeTab === "share" && (
            <div className="space-y-6">
              {/* Lien principal */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-slate-900 text-base">Lien Public de votre Boutique</h3>
                </div>

                <p className="text-xs text-slate-500">
                  Transmettez ce lien à vos clients sur WhatsApp, Facebook ou Instagram pour qu&apos;ils accèdent directement à vos produits.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <input
                    type="text"
                    value={shopUrl}
                    readOnly
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none"
                  />
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(shopUrl)}
                      className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedUrl ? "Copié" : "Copier"}</span>
                    </button>

                    <a
                      href={shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ouvrir</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Boutons de Partage Réseaux */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Share2 className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-slate-900 text-base">Partage Direct sur les Réseaux</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={shareToWhatsApp}
                    className="p-4 bg-emerald-50 hover:bg-emerald-600 text-emerald-900 hover:text-white rounded-2xl border border-emerald-100 transition-all flex flex-col items-center gap-2 group"
                  >
                    <MessageSquare className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                    <span className="text-xs font-bold">WhatsApp</span>
                  </button>

                  <button
                    onClick={shareToFacebook}
                    className="p-4 bg-blue-50 hover:bg-blue-600 text-blue-900 hover:text-white rounded-2xl border border-blue-100 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Facebook className="w-6 h-6 text-blue-600 group-hover:text-white" />
                    <span className="text-xs font-bold">Facebook</span>
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="p-4 bg-sky-50 hover:bg-sky-500 text-sky-900 hover:text-white rounded-2xl border border-sky-100 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Twitter className="w-6 h-6 text-sky-500 group-hover:text-white" />
                    <span className="text-xs font-bold">Twitter</span>
                  </button>

                  <button
                    onClick={shareByEmail}
                    className="p-4 bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white rounded-2xl border border-slate-200 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Mail className="w-6 h-6 text-slate-700 group-hover:text-white" />
                    <span className="text-xs font-bold">Email</span>
                  </button>
                </div>
              </div>

              {/* QR Code HD */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4 text-center sm:text-left">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <QrCode className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-slate-900 text-base">QR Code de la Boutique</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm shrink-0">
                    <img src={qrCodeUrl} alt="QR Code Boutique" className="w-40 h-40" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">QR Code Téléchargeable HD</h4>
                    <p className="text-xs text-slate-500 max-w-md">
                      Imprimez ce QR Code sur vos affiches, sacs d&apos;emballage ou flyers pour permettre à vos clients de scanner et commander immédiatement.
                    </p>

                    <a
                      href={qrCodeUrl}
                      download={`qr-code-${vendorProfile?.name || "boutique"}.png`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger le QR Code (PNG)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. NOTIFICATIONS & SÉCURITÉ */}
          {activeTab === "notifications" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Bell className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-slate-900 text-base">Préférences de Notification & Sécurité</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Alertes WhatsApp immédiates</h4>
                    <p className="text-[11px] text-slate-500">Recevoir un message sur WhatsApp dès qu&apos;un client passe une commande</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.whatsappOrderAlerts}
                    onChange={(e) => setNotifications({ ...notifications, whatsappOrderAlerts: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Notifications par Email</h4>
                    <p className="text-[11px] text-slate-500">Recevoir le récapitulatif quotidien des ventes par mail</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailOrderAlerts}
                    onChange={(e) => setNotifications({ ...notifications, emailOrderAlerts: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Alerte Stock Faible</h4>
                    <p className="text-[11px] text-slate-500">Être prévenu lorsque le stock d&apos;un produit passe sous les 5 unités</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-400" /> Sécurité du compte vendeur
                </span>
                <button
                  onClick={() => toast.success("Lien de réinitialisation du mot de passe envoyé !")}
                  type="button"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Changer le mot de passe
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
