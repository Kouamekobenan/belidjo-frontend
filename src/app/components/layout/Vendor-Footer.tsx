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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-auto">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Colonne 1: À propos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {site.logoUrl ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white p-1">
                  <Image
                    src={site.logoUrl}
                    alt={`Logo ${name}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-teal-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-white">{name}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {site.description ||
                "Votre partenaire de confiance pour tous vos besoins."}
            </p>
            {/* Réseaux sociaux */}
          </div>

          {/* Colonne 2: Navigation rapide */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b-2 border-teal-600 pb-2 inline-block">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-200"></span>
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-200"></span>
                  Produits
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-200"></span>
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-200"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Informations légales */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b-2 border-teal-600 pb-2 inline-block">
              Informations
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-200"></span>
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-200"></span>
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-200"></span>
                  Politique de retour
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-200"></span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b-2 border-teal-600 pb-2 inline-block">
              Contactez-nous
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <Globe className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <a
                  href={`https://${site.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors duration-200 break-all"
                >
                  {site.domain}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:contact@${user.email}`}
                  className="hover:text-teal-400 transition-colors duration-200 break-all"
                >
                  contact:{user.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>{user.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barre de séparation */}
      <div className="border-t border-gray-700"></div>

      {/* Section copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            © {currentYear}{" "}
            <span className="font-semibold text-white">{name}</span>. Tous
            droits réservés.
          </p>
          <p className="flex items-center gap-2 text-gray-400 text-sm">
            Conçu avec <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
            par{" "}
            <span className="font-semibold text-teal-400">Votre Équipe</span>
          </p>
        </div>
      </div>

      {/* Effet de gradient décoratif */}
      <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600"></div>
    </footer>
  );
};
