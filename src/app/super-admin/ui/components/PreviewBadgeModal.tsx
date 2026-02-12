"use client";
import React, { useState, useRef } from "react";
import {
  Eye,
  X,
  Download,
  Sparkles,
  Shield,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Vendor } from "@/app/vendor/domain/entities/vendor.entity";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import Image from "next/image";

export default function PreviewBadgeModal({ vendor }: { vendor: Vendor }) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    if (cardRef.current === null) return;
    const loadToast = toast.loading("Génération de votre badge premium...");
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `noboutik-badge-${vendor.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("✨ Badge prêt pour vos réseaux !", { id: loadToast });
    } catch (err) {
      toast.error("Erreur lors de la génération", { id: loadToast });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative p-2.5 text-slate-600 hover:text-teal-600 transition-all duration-300 bg-white rounded-xl border border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-md"
        title="Voir le badge de certification"
      >
        <Eye size={16} className="relative z-10" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
          {/* Container pour scroller sur petits écrans desktop */}
          <div className="min-h-full py-8 flex items-center justify-center w-full">
            <div className="relative max-w-sm w-full animate-in fade-in zoom-in duration-300">
              {/* BARRE D'ACTIONS AMÉLIORÉE */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-white text-slate-900 px-5 py-3 rounded-2xl text-sm font-black shadow-xl hover:bg-teal-50 transition-colors"
                >
                  <Download size={18} className="text-teal-600" />
                  TÉLÉCHARGER LE BADGE
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* --- ZONE DE CAPTURE --- */}
              <div
                ref={cardRef}
                className="relative overflow-hidden w-full aspect-[4/5] rounded-[2.5rem] bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)]"
              >
                {/* BACKGROUND DESIGN */}
                <div className="absolute inset-0">
                  {/* Dégradé de base */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/50" />
                  {/* Formes organiques premium */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                </div>

                {/* CONTENT */}
                <div className="relative z-10 h-full flex flex-col p-8">
                  {/* Badge de tête */}
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 bg-slate-900 px-4 py-1.5 rounded-full shadow-lg">
                      <CheckCircle2 size={12} className="text-teal-400" />
                      <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                        Vendeur Certifié
                      </span>
                    </div>
                  </div>
                  {/* Logo / Image de profil */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative mb-6">
                      <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 blur-2xl rounded-full" />
                      <div className="relative w-32 h-32 rounded-[2rem] bg-gradient-to-br from-teal-600 to-emerald-600 p-1 shadow-2xl rotate-3">
                        <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center overflow-hidden -rotate-3">
                          {vendor.site?.logoUrl ? (
                            <Image
                              src={vendor.site.logoUrl}
                              width={100}
                              height={100}
                              alt="logo"
                              className="object-contain p-2"
                            />
                          ) : (
                            <span className="text-4xl font-black bg-gradient-to-br from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                              {vendor.name.substring(0, 1)}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Pastille de vérification flottante */}
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-xl border-4 border-white">
                        <Shield size={20} fill="currentColor" />
                      </div>
                    </div>
                    {/* Infos Vendeur */}
                    <h3 className="font-black text-slate-900 text-3xl text-center leading-tight mb-2 uppercase tracking-tight px-4">
                      {vendor.name}
                    </h3>
                    <div className="flex items-center gap-2 py-1.5 px-4 bg-teal-50 rounded-full">
                      <Sparkles size={12} className="text-teal-600" />
                      <span className="text-teal-700 font-bold text-xs">
                        @{vendor.user?.name}
                      </span>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center"
                          >
                            <Star
                              size={10}
                              className="text-teal-500 fill-teal-500"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Partenaire Elite
                      </span>
                    </div>
                  </div>

                  {/* Footer Badge */}
                  <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Localisation
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {vendor.city?.name}, {vendor.city?.country || "CI"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black tracking-tighter text-slate-900 leading-none">
                        NOBOUTIK
                      </p>
                      <p className="text-[7px] font-bold text-teal-600 tracking-[0.2em] uppercase">
                        Boutique Officielle
                      </p>
                    </div>
                  </div>
                </div>

                {/* Barre de décoration latérale signature */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-teal-500 to-emerald-600" />
              </div>

              {/* TOOLTIP SHARE */}
              <p className="mt-6 text-white/50 text-center text-[11px] font-medium italic">
                "Ce badge est la preuve de votre engagement et de votre
                professionnalisme."
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
