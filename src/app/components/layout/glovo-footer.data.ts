export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface PaymentMethod {
  name: string;
  color: string;
}

export const GLOVO_FOOTER_DATA = {
  brand: {
    name: "NoBoutik",
    tagline: "Votre marketplace locale connectée",
    description:
      "Commandez auprès des meilleurs commerçants, maquis, supermarchés et boutiques de Bondoukou et partout en Côte d'Ivoire. Livré chez vous rapidement et en toute sécurité.",
    supportPhone: "+225 05 06 83 26 78",
    supportEmail: "contact@noboutik.ci",
    address: "Bondoukou, Zanzan - Côte d'Ivoire",
  },
  appBanner: {
    title: "NoBoutik dans votre poche !",
    subtitle:
      "Téléchargez l'application mobile NoBoutik pour suivre vos livraisons en temps réel et profiter d'offres exclusives.",
    appStoreUrl: "#",
    playStoreUrl: "#",
    rating: "4.9/5",
    downloadsCount: "+50 000 téléchargements",
  },
  partnerLinks: {
    title: "Rejoignez l'aventure",
    links: [
      { label: "Devenir Vendeur / Boutik", href: "/vendors", badge: "Populaire" },
      { label: "Devenir Coursier / Livreur", href: "#", badge: "Recrutement" },
      { label: "NoBoutik pour Entreprises (B2B)", href: "#" },
      { label: "Carrières & Offres d'emploi", href: "#" },
      { label: "Espace Presse & Média", href: "#" },
    ],
  },
  categories: {
    title: "Catégories populaires",
    links: [
      { label: "Supermarché & Épicerie", href: "/vendor?category=supermarket" },
      { label: "Restaurants & Maquis", href: "/vendor?category=restaurants" },
      { label: "Produits Frais du Marché", href: "/vendor?category=fresh" },
      { label: "Mode, Chaussures & Beauté", href: "/vendor?category=fashion" },
      { label: "Hi-Tech & Électronique", href: "/vendor?category=electronics" },
      { label: "Pharmacie & Santé", href: "/vendor?category=health" },
      { label: "Électroménager & Maison", href: "/vendor?category=home" },
    ],
  },
  cities: {
    title: "Villes & Zones desservies",
    links: [
      { label: "Bondoukou (Centre & Zanzan)", href: "/vendor?city=bondoukou" },
      { label: "Abidjan - Cocody & Riviera", href: "/vendor?city=cocody" },
      { label: "Abidjan - Yopougon & Songon", href: "/vendor?city=yopougon" },
      { label: "Abidjan - Marcory & Zone 4", href: "/vendor?city=marcory" },
      { label: "Abidjan - Plateau & Adjamé", href: "/vendor?city=plateau" },
      { label: "Bouaké & Yamoussoukro", href: "/vendor?city=bouake" },
      { label: "San-Pédro & Korhogo", href: "/vendor?city=san-pedro" },
    ],
  },
  helpAndLegal: {
    title: "Aide & Informations légales",
    links: [
      { label: "Centre d'aide & FAQ", href: "/faq" },
      { label: "Suivre ma commande en direct", href: "#" },
      { label: "Conditions Générales d'Utilisation", href: "/terms" },
      { label: "Politique de Confidentialité", href: "/privacy" },
      { label: "Politique des Cookies", href: "/cookies" },
      { label: "Sécurité & Signalement", href: "#" },
      { label: "Retours et Remboursements", href: "/refund" },
    ],
  },
  paymentMethods: [
    { name: "Wave", color: "bg-cyan-500 text-white" },
    { name: "Orange Money", color: "bg-orange-500 text-white" },
    { name: "MTN MoMo", color: "bg-yellow-400 text-slate-900 font-bold" },
    { name: "Moov Money", color: "bg-blue-600 text-white" },
    { name: "Visa / Mastercard", color: "bg-indigo-600 text-white" },
    { name: "Cash à la livraison", color: "bg-green-600 text-white" },
  ],
};
