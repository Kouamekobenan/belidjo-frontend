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
} from "lucide-react";

interface IvendorProfile {
  id?: string;
  name?: string;
}

interface ParamVendorProps {
  vendorProfile?: IvendorProfile;
}

export default function ParamVendor({ vendorProfile }: ParamVendorProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // Construction des URLs
  const shopUrl = `${window.location.origin}/products/ui/page/${vendorProfile?.id}`;

  // Fonction de copie
  const handleCopy = useCallback(
    async (text: string, type: "url" | "domain") => {
      try {
        await navigator.clipboard.writeText(text);

        if (type === "url") {
          setCopiedUrl(true);
          setTimeout(() => setCopiedUrl(false), 3000);
        } else {
          setCopiedDomain(true);
          setTimeout(() => setCopiedDomain(false), 3000);
        }
      } catch (err) {
        console.error("Erreur lors de la copie:", err);
        alert("Impossible de copier. Veuillez réessayer.");
      }
    },
    []
  );

  // Fonction de partage natif
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Visitez ${vendorProfile?.name}`,
          text: `Découvrez ma boutique en ligne !`,
          url: shopUrl,
        });
      } catch (err) {
        console.error("Erreur lors du partage:", err);
      }
    } else {
      handleCopy(shopUrl, "url");
    }
  }, [shopUrl, vendorProfile?.name, handleCopy]);

  // Fonctions de partage social
  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shopUrl
      )}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shopUrl
      )}&text=${encodeURIComponent(`Découvrez ${vendorProfile?.name} !`)}`,
      "_blank"
    );
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Découvrez ma boutique : ${shopUrl}`
      )}`,
      "_blank"
    );
  };

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      `Découvrez ${vendorProfile?.name}`
    )}&body=${encodeURIComponent(`Visitez ma boutique en ligne : ${shopUrl}`)}`;
  };

  // Générer un QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    shopUrl
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Paramètres
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm">
                Gérez votre boutique en ligne
              </p>
            </div>
          </div>
        </div>

        {/* Section: Lien de la boutique */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Lien de votre boutique
            </h2>
          </div>

          <p className="text-slate-600 mb-3 sm:mb-4 text-xs sm:text-sm">
            Partagez ce lien avec vos clients pour qu'ils accèdent directement à
            votre boutique
          </p>

          {/* URL Principale */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-slate-200">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
              URL de votre boutique
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={shopUrl}
                readOnly
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-slate-800 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-0"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(shopUrl, "url")}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg text-sm"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
                <a
                  href={shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ouvrir</span>
                </a>
              </div>
            </div>
          </div>

          {/* Domaine Personnalisé */}
          {vendorProfile?.id && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
              <label className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                Domaine personnalisé
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={shopUrl}
                  readOnly
                  className="flex-1 bg-white border border-blue-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-slate-800 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                />
                <button
                  onClick={() => handleCopy(shopUrl, "domain")}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg text-sm"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Section: Options de partage */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Partager votre boutique
            </h2>
          </div>

          <p className="text-slate-600 mb-4 sm:mb-6 text-xs sm:text-sm">
            Partagez facilement votre boutique sur vos réseaux sociaux
          </p>

          {/* Bouton de partage natif */}
          <button
            onClick={handleNativeShare}
            className="w-full mb-4 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Partager maintenant
          </button>

          {/* Réseaux sociaux */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={shareToWhatsApp}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg sm:rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                WhatsApp
              </span>
            </button>

            <button
              onClick={shareToFacebook}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg sm:rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                Facebook
              </span>
            </button>

            <button
              onClick={shareToTwitter}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg sm:rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                Twitter
              </span>
            </button>

            <button
              onClick={shareByEmail}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg sm:rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                Email
              </span>
            </button>
          </div>
        </div>

        {/* Section: QR Code */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              QR Code
            </h2>
          </div>

          <p className="text-slate-600 mb-3 sm:mb-4 text-xs sm:text-sm">
            Générez un QR Code pour permettre à vos clients d'accéder rapidement
            à votre boutique
          </p>

          <button
            onClick={() => setShowQrCode(!showQrCode)}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 border border-slate-300 text-sm sm:text-base"
          >
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            {showQrCode ? "Masquer le QR Code" : "Afficher le QR Code"}
          </button>

          {showQrCode && (
            <div className="mt-4 sm:mt-6 flex flex-col items-center">
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-2 sm:border-4 border-slate-200">
                <img
                  src={qrCodeUrl}
                  alt="QR Code de la boutique"
                  className="w-48 h-48 sm:w-64 sm:h-64"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 sm:mt-4 text-center px-4">
                Scannez ce code avec un téléphone pour accéder à la boutique
              </p>
              <a
                href={qrCodeUrl}
                download={`qr-code-${vendorProfile?.name}.png`}
                className="mt-3 sm:mt-4 px-4 sm:px-6 py-2.5 sm:py-3 bg-teal-500 cursor-pointer hover:bg-teal-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                Télécharger le QR Code
              </a>
            </div>
          )}
        </div>

        {/* Info supplémentaire */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base sm:text-lg">
                💡
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">
                Conseil
              </h3>
              <p className="text-xs sm:text-sm text-slate-700">
                Partagez régulièrement le lien de votre boutique sur vos réseaux
                sociaux et avec vos contacts pour augmenter votre visibilité et
                vos ventes !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
