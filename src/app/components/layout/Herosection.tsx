import Link from "next/link";
import Image from "next/image"; // Utilisation de l'optimisation Next.js
import { AnimatedHeroTitle } from "../features/AnimationHome";
import { ArrowRight, CheckCircle2 } from "lucide-react";
export const HeroSection = () => {
  return (
    <section
      className="relative h-[450px] md:h-[450px] w-full flex items-center justify-center text-white overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* --- ARRIÈRE-PLAN --- */}
      <div className="absolute inset-0 z-0">
        {/* Image de haute qualité (Placeholder thématique e-commerce/logistique) */}
        <Image
          src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop"
          alt="Background Hero"
          fill
          className="object-cover object-center transition-transform duration-1000 hover:scale-105"
          priority
        />
        {/* Overlay Professionnel : Mélange de dégradé sombre et de couleur de marque */}
        <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/40 via-transparent to-slate-900/90"></div>
        {/* Texture de grille subtile */}
        <div className="absolute inset-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>
      {/* --- CONTENU PRINCIPAL --- */}
      <div className="relative z-10 px-4 sm:px-6 w-full max-w-5xl text-center">
        {/* Badge optionnel pour le "Professional look" */}
        <div className="mb-6 flex justify-center animate-fade-in">
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest">
            Plateforme n°1 des Vendeurs
          </span>
        </div>

        <AnimatedHeroTitle />

        {/* Caractéristiques avec icônes plus pros */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base text-white/80 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span>Livraison rapide</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 bg-white/20 rounded-full" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span>Vendeurs spécialisés</span>
          </div>
        </div>
        {/* Bouton CTA Modernisé */}
        <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center px-4">
          <Link
            href="/vendor/vendorform"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-teal-500 hover:bg-teal-400 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <span className="relative flex items-center">
              Démarrer ma boutique
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
