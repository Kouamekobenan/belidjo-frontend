"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Smartphone,
  Star,
  Zap,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronUp,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Store,
  Bike,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { GLOVO_FOOTER_DATA } from "./glovo-footer.data";

export const GlovoFooter = () => {
  const currentYear = new Date().getFullYear();
  const [selectedCountry, setSelectedCountry] = useState("ci");
  const [selectedLang, setSelectedLang] = useState("fr");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-900 text-gray-300 font-sans mt-12 rounded-t-[2.5rem] sm:rounded-t-[3.5rem] border-t-4 border-green-600 shadow-2xl overflow-hidden">
      {/* ========================================================================= */}
      {/* BANNIÈRE SUPERIEURE : APPLICATION MOBILE (Couleurs Unies NoBoutik) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="relative rounded-3xl bg-gray-800 p-8 md:p-12 border border-gray-700 shadow-xl overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Texte & Titre */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-600/20 border border-green-600/40 text-green-400 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Expérience 100% Mobile</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {GLOVO_FOOTER_DATA.appBanner.title}
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                {GLOVO_FOOTER_DATA.appBanner.subtitle}
              </p>

              {/* Valeurs clés rapides */}
              <div className="pt-2 grid grid-cols-3 gap-3 max-w-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-green-400">
                  <Zap className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Livraison Express</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-green-400">
                  <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Mobile Money</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-green-400">
                  <Clock className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>

            {/* Téléchargement App & Badges */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-center gap-4">
              <div className="flex flex-wrap gap-3">
                {/* Bouton App Store */}
                <a
                  href={GLOVO_FOOTER_DATA.appBanner.appStoreUrl}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-3 px-5 py-3.5 bg-black hover:bg-green-700 text-white rounded-2xl border border-gray-700 hover:border-green-600 shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Smartphone className="w-6 h-6 text-green-500" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Télécharger sur</div>
                    <div className="text-sm font-bold text-white">App Store</div>
                  </div>
                </a>

                {/* Bouton Google Play */}
                <a
                  href={GLOVO_FOOTER_DATA.appBanner.playStoreUrl}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-3 px-5 py-3.5 bg-black hover:bg-green-700 text-white rounded-2xl border border-gray-700 hover:border-green-600 shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Smartphone className="w-6 h-6 text-green-500" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Disponible sur</div>
                    <div className="text-sm font-bold text-white">Google Play</div>
                  </div>
                </a>
              </div>

              {/* Stat & Rating */}
              <div className="flex items-center justify-between sm:justify-start lg:justify-between gap-4 px-4 py-2.5 bg-gray-900 rounded-xl border border-gray-700">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-black text-white">{GLOVO_FOOTER_DATA.appBanner.rating}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">{GLOVO_FOOTER_DATA.appBanner.downloadsCount}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONTENU PRINCIPAL MULTI-COLONNES */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Colonne 1 : Brand & Vision NoBoutik */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/vendor" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md border border-gray-700 overflow-hidden">
                <Image
                  src="/images/bj.png"
                  alt="NoBoutik Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-green-500 transition-colors">
                  {GLOVO_FOOTER_DATA.brand.name}
                </span>
                <span className="text-green-500 font-extrabold text-2xl">.</span>
                <p className="text-[11px] font-semibold text-green-500 uppercase tracking-widest">
                  {GLOVO_FOOTER_DATA.brand.tagline}
                </p>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed">
              {GLOVO_FOOTER_DATA.brand.description}
            </p>

            {/* Coordonnées rapides */}
            <div className="space-y-3 text-xs text-gray-300">
              <a
                href={`tel:${GLOVO_FOOTER_DATA.brand.supportPhone}`}
                className="flex items-center gap-3 hover:text-green-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-600/10 flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-semibold">{GLOVO_FOOTER_DATA.brand.supportPhone}</span>
              </a>

              <a
                href={`mailto:${GLOVO_FOOTER_DATA.brand.supportEmail}`}
                className="flex items-center gap-3 hover:text-green-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-600/10 flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{GLOVO_FOOTER_DATA.brand.supportEmail}</span>
              </a>

              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-green-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{GLOVO_FOOTER_DATA.brand.address}</span>
              </div>
            </div>

            {/* Réseaux Sociaux */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                Suivez NoBoutik sur les réseaux
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 hover:bg-green-600 hover:text-white flex items-center justify-center text-gray-300 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 hover:bg-green-600 hover:text-white flex items-center justify-center text-gray-300 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 hover:bg-green-600 hover:text-white flex items-center justify-center text-gray-300 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 hover:bg-green-600 hover:text-white flex items-center justify-center text-gray-300 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Colonne 2 : Rejoignez l'aventure */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
              <Store className="w-4 h-4 text-green-500" />
              <span>{GLOVO_FOOTER_DATA.partnerLinks.title}</span>
            </h4>
            <ul className="space-y-2.5">
              {GLOVO_FOOTER_DATA.partnerLinks.links.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group text-xs text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-between py-1"
                  >
                    <span className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-green-500 transition-colors" />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-600/20 text-green-400 border border-green-600/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Catégories populaires */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
              <Bike className="w-4 h-4 text-green-500" />
              <span>{GLOVO_FOOTER_DATA.categories.title}</span>
            </h4>
            <ul className="space-y-2.5">
              {GLOVO_FOOTER_DATA.categories.links.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group text-xs text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-2 py-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-green-500 transition-colors" />
                    <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Villes & Support */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-gray-800 pb-3 mb-4">
                Villes Phares
              </h4>
              <ul className="space-y-2">
                {GLOVO_FOOTER_DATA.cities.links.slice(0, 4).map((city) => (
                  <li key={city.label}>
                    <Link
                      href={city.href}
                      className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5"
                    >
                      {city.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-gray-800 pb-3 mb-4">
                Légal & Aide
              </h4>
              <ul className="space-y-2">
                {GLOVO_FOOTER_DATA.helpAndLegal.links.slice(0, 4).map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-400 hover:text-green-400 transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SÉLECTEUR REGIONAL & MOYENS DE PAIEMENT */}
      {/* ========================================================================= */}
      <div className="border-t border-b border-gray-800 bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">

            {/* Sélecteur Pays / Langue */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white">
                <Globe className="w-4 h-4 text-green-500" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-transparent font-semibold cursor-pointer outline-none text-white pr-2"
                >
                  <option value="ci" className="bg-gray-900 text-white">🇨🇮 Côte d'Ivoire (CI)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-transparent font-semibold cursor-pointer outline-none text-white pr-2"
                >
                  <option value="fr" className="bg-gray-900 text-white">Français (FR)</option>
                  <option value="en" className="bg-gray-900 text-white">English (EN)</option>
                </select>
              </div>

              <div className="px-3.5 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs font-bold text-green-400">
                Devise: XOF (FCFA)
              </div>
            </div>

            {/* Badges de paiement Mobile Money */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline">
                Paiements acceptés :
              </span>
              {GLOVO_FOOTER_DATA.paymentMethods.map((pm) => (
                <span
                  key={pm.name}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${pm.color} transition-transform hover:scale-105`}
                >
                  {pm.name}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BARRE DE COPYRIGHT & BOUTON RETOUR EN HAUT (Mobile padding pb-28) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center sm:text-left">
            © {currentYear} <span className="font-bold text-white">NoBoutik Inc.</span> Tous droits réservés.
          </p>

          <div className="flex items-center gap-2">
            <span>Développé pour dynamiser le commerce local à Bondoukou & en CI</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white font-bold rounded-xl border border-gray-700 hover:border-green-600 transition-all duration-200 shadow-md"
          >
            <span>Retour en haut</span>
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default GlovoFooter;
