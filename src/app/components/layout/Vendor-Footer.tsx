import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface Vendor {
  name: string;
  site: {
    logoUrl: string;
    description: string;
    domain: string;
  };
  user: {
    email: string;
    phone: string;
    cityName: string;
  };
}

export const VendorFooter = ({ name, site, user }: Vendor) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-slate-400 mt-20">
      {/* Ligne d'accentuation supérieure */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Branding & Bio - Prend plus d'espace */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
              {site.logoUrl ? (
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white p-2 shadow-xl shadow-teal-500/10 border border-white/10">
                  <Image
                    src={site.logoUrl}
                    alt={name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <span className="text-white font-black text-2xl">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-2xl font-black text-white tracking-tight">
                {name}
              </span>
            </div>

            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              {site.description ||
                "Élever votre expérience shopping avec une sélection rigoureuse de produits de qualité supérieure."}
            </p>

            {/* Social Proof / Trust Badge */}
            <div className="flex items-center gap-2 py-2 px-4 bg-white/5 rounded-full border border-white/10 w-fit">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Vendeur Vérifié
              </span>
            </div>
          </div>

          {/* Navigation - Organisation en colonnes flexibles */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em]">
                Boutique
              </h4>
              <ul className="space-y-4">
                {["Accueil", "Produits", "Promotions", "Nouveautés"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="hover:text-teal-400 transition-all duration-300 flex items-center group"
                      >
                        <span className="h-[1px] w-0 bg-teal-400 group-hover:w-3 mr-0 group-hover:mr-2 transition-all"></span>
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em]">
                Aide
              </h4>
              <ul className="space-y-4">
                {[
                  "Livraison",
                  "Retours",
                  "Mentions Légales",
                  "Confidentialité",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Card - Look très Pro */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em]">
              Contact Direct
            </h4>
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-5">
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                  <Mail className="w-5 h-5 text-teal-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">
                    Email
                  </p>
                  <p className="text-sm text-white font-medium">{user.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">
                    Téléphone
                  </p>
                  <p className="text-sm text-white font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">
                    Localisation
                  </p>
                  <p className="text-sm text-white font-medium">
                    {user.cityName || "Abidjan, CI"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <Facebook className="w-5 h-5 hover:text-teal-400 cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 hover:text-teal-400 cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 hover:text-teal-400 cursor-pointer transition-colors" />
          </div>

          <p className="text-sm">
            © {currentYear} <span className="text-white font-bold">{name}</span>
            . Conçu avec passion par{" "}
            <span className="text-teal-500 font-semibold underline underline-offset-4 decoration-teal-500/30">
              L&apos;équipe noboutik
            </span>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            Retour en haut ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
