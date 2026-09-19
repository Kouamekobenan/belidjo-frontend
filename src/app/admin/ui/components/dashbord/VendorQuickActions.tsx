"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Share2,
  Video,
  Eye,
  Settings,
  Check,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface QuickActionsProps {
  vendorId?: string;
  storeName?: string;
}

export const VendorQuickActions: React.FC<QuickActionsProps> = ({
  vendorId,
  storeName = "Ma Boutique",
}) => {
  const [copied, setCopied] = useState(false);

  const publicStoreUrl = vendorId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/products/ui/page/${vendorId}`
    : "#";

  const handleShareWhatsApp = () => {
    const text = `Bonjour ! Découvrez nos produits et nouveautés sur notre boutique en ligne ${storeName} : ${publicStoreUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicStoreUrl);
      setCopied(true);
      toast.success("Lien de votre boutique copié dans le presse-papier !");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Raccourcis Commerçant</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Actions rapides</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Ajouter Produit */}
        <Link
          href="/admin/products"
          className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-green-600 text-slate-700 hover:text-white rounded-2xl border border-slate-100 transition-all duration-200 group text-center shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-green-600 group-hover:text-white mb-2 shadow-xs transition-colors">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Nouveau Produit</span>
          <span className="text-[10px] opacity-70 mt-0.5">Ajouter au catalogue</span>
        </Link>

        {/* 2. Partager sur WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-2xl border border-emerald-100 transition-all duration-200 group text-center shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-emerald-600 group-hover:text-white mb-2 shadow-xs transition-colors">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Partager WhatsApp</span>
          <span className="text-[10px] opacity-80 mt-0.5">Envoyer aux clients</span>
        </button>

        {/* 3. Studio Vidéo Promo */}
        <Link
          href="/admin/template/page"
          className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-600 text-purple-800 hover:text-white rounded-2xl border border-purple-100 transition-all duration-200 group text-center shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-purple-600 group-hover:text-white mb-2 shadow-xs transition-colors">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Créateur Vidéo</span>
          <span className="text-[10px] opacity-80 mt-0.5">Studio publicitaire</span>
        </Link>

        {/* 4. Aperçu Boutique */}
        <Link
          href={publicStoreUrl}
          target="_blank"
          className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-600 text-blue-800 hover:text-white rounded-2xl border border-blue-100 transition-all duration-200 group text-center shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-blue-600 group-hover:text-white mb-2 shadow-xs transition-colors">
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Voir ma boutique</span>
          <span className="text-[10px] opacity-80 mt-0.5">Aperçu client</span>
        </Link>
      </div>

      {/* Barre d'accès rapide au lien */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-500 font-medium truncate">
          Lien boutique : <span className="text-slate-900 font-bold">{publicStoreUrl}</span>
        </span>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-green-600 text-white font-bold rounded-xl transition-all shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Copié !" : "Copier le lien"}</span>
        </button>
      </div>
    </div>
  );
};

export default VendorQuickActions;
