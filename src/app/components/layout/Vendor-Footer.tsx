import React from "react";
import Image from "next/image";
import { Globe, Mail, Phone, MapPin, Heart } from "lucide-react";

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
  name: string;
  site: Site;
  user: User;
}

export const VendorFooter = ({ name, site, user }: Vendor) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 mt-auto">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Colonne 1: À propos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {site.logoUrl ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-200 p-1">
                  <Image
                    src={site.logoUrl}
                    alt={`Logo ${name}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-teal-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm">
              {site.description ||
                "Votre partenaire de confiance pour tous vos besoins."}
            </p>
          </div>

          {/* Colonne 2: Navigation rapide */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-teal-500 pb-2 inline-block">
              Navigation
            </h4>
            <ul className="space-y-3">
              {["Accueil", "Produits", "À propos", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-600 hover:text-teal-600 transition-colors duration-200 flex items-center gap-2 group text-sm font-medium"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-500 transition-all duration-200"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Colonne 3: Informations légales */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-teal-500 pb-2 inline-block">
              Informations
            </h4>
            <ul className="space-y-3">
              {[
                "Conditions d'utilisation",
                "Politique de confidentialité",
                "Politique de retour",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-600 hover:text-teal-600 transition-colors duration-200 flex items-center gap-2 group text-sm font-medium"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-500 transition-all duration-200"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Colonne 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-teal-500 pb-2 inline-block">
              Contactez-nous
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-600">
                <Mail className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${user.email}`}
                  className="hover:text-teal-600 transition-colors duration-200 break-all text-sm"
                >
                  {user.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <Phone className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{user.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Barre de séparation discrète */}
      <div className="border-t border-slate-200"></div>
      {/* Section copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {currentYear}{" "}
            <span className="font-semibold text-slate-900">{name}</span>. Tous
            droits réservés.
          </p>
          <p className="flex items-center gap-2 text-slate-500 text-sm">
            Conçu avec <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />{" "}
            par{" "}
            <span className="font-semibold text-teal-600">Votre Équipe</span>
          </p>
        </div>
      </div>
      {/* Finition élégante */}
      <div className="h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500"></div>
    </footer>
  );
};
