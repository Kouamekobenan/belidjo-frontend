import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Shield,
  TrendingUp,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Colonne 1 : À propos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/bj.png"
                width={60}
                height={60}
                alt="Logo Belidjo"
                className="rounded-lg"
              />
              <h2 className="text-2xl font-bold text-white">Belidjo</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Votre plateforme de commerce en ligne de confiance à Bondoukou.
              Achetez et vendez facilement vos produits localement.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-teal-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-green-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b-2 border-teal-600 inline-block pb-2">
              Liens Rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/vendor"
                  className="flex items-center gap-2 hover:text-teal-400 transition-colors duration-200"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Trouvez un vendeur
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 hover:text-teal-400 transition-colors duration-200"
                >
                  <Heart className="w-4 h-4" />À Propos
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors"
                  className="flex items-center gap-2 hover:text-teal-400 transition-colors duration-200"
                >
                  <TrendingUp className="w-4 h-4" />
                  Devenir Vendeur
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="flex items-center gap-2 hover:text-teal-400 transition-colors duration-200"
                >
                  <Shield className="w-4 h-4" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          {/* Colonne 3 : Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b-2 border-teal-600 inline-block pb-2">
              Contactez-nous
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+2250506832678"
                  className="flex items-start gap-3 hover:text-teal-400 transition-colors duration-200 group"
                >
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm">
                    +225 05 06 83 26 78
                    <br />
                    <span className="text-xs text-gray-500">
                      Lun - Sam : 8h - 18h
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@belidjo.com"
                  className="flex items-start gap-3 hover:text-teal-400 transition-colors duration-200 group"
                >
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm break-all">
                    kouamenelson47@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-teal-500" />
                  <span className="text-sm">
                    Bondoukou, Zanzan
                    <br />
                    Côte d'Ivoire
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Informations légales */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b-2 border-teal-600 inline-block pb-2">
              Informations Légales
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-teal-400 transition-colors duration-200 text-sm"
                >
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-teal-400 transition-colors duration-200 text-sm"
                >
                  Conditions d'Utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-teal-400 transition-colors duration-200 text-sm"
                >
                  Politique des Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="hover:text-teal-400 transition-colors duration-200 text-sm"
                >
                  Retours et Remboursements
                </Link>
              </li>
            </ul>

            {/* Badge de sécurité */}
            <div className="mt-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-teal-500" />
                <span className="text-xs font-semibold text-white">
                  Paiement Sécurisé
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Vos données sont protégées
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section du bas */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Belidjo. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>à Bondoukou, Côte d'Ivoire</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
