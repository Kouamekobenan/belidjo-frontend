"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Gift, TrendingUp, X, ChevronRight } from "lucide-react";

interface AnimatedPromoBannerProps {
  user?: any; // Votre type d'utilisateur
}

export default function AnimatedPromoBanner({
  user,
}: AnimatedPromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (user && isVisible) {
    return (
      <div
        className={`
          relative overflow-hidden
          bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50
          border-t border-b border-teal-200/60
          shadow-xl
          transform transition-all duration-500 ease-out
          ${
            isAnimating
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }
        `}
      >
        {/* Effet de brillance animé en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-full animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
        </div>

        {/* Particules décoratives animées */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-float-1"></div>
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-2"></div>
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float-3"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-float-4"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Icône animée */}
            <div className="flex-shrink-0 hidden sm:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full blur-md opacity-50 animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-r from-teal-500 to-purple-600 p-2 rounded-full animate-bounce-gentle">
                  <Gift className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 text-center">
              <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed">
                {/* Badge "Offre exclusive" animé */}
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-wiggle mr-2">
                  <Sparkles className="w-3 h-3 animate-spin-slow" />
                  <span>OFFRE EXCLUSIVE</span>
                  <Sparkles className="w-3 h-3 animate-spin-slow" />
                </span>

                {/* Texte principal avec animations */}
                <span className="inline-block animate-fade-in-up">
                  <Link
                    href="/users/ui/login"
                    className="group relative inline-flex items-center font-bold text-transparent bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text animate-gradient-x hover:scale-105 transition-transform duration-300"
                  >
                    <span className="relative text-green-600">
                      avec Belidjo
                      {/* Effet de soulignement animé */}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-600 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </span>

                {/* Texte secondaire responsive */}
                <span className="hidden sm:inline ml-2 text-gray-700">
                  <span className="inline-flex items-center space-x-1">
                    <span>profitez de</span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded-full animate-pulse-slow">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      -20%
                    </span>
                    <span>de réduction !</span>
                  </span>
                </span>
                <span className="sm:hidden ml-2 text-gray-700 text-xs">
                  pour des réductions !
                </span>
              </p>
            </div>

            {/* Bouton de fermeture */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-200/50 transition-colors group"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>

          {/* Barre de progression animée (optionnel) */}
          <div className="mt-2 w-full h-1 bg-gray-200/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 animate-progress"></div>
          </div>
        </div>

        {/* Styles pour les animations */}
        <style jsx>{`
          @keyframes shine {
            0% {
              transform: translateX(-100%) skewX(-12deg);
            }
            100% {
              transform: translateX(200%) skewX(-12deg);
            }
          }

          @keyframes float-1 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.6;
            }
            50% {
              transform: translate(-10px, -15px) scale(1.2);
              opacity: 1;
            }
          }

          @keyframes float-2 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.5;
            }
            50% {
              transform: translate(15px, -20px) scale(1.3);
              opacity: 0.9;
            }
          }

          @keyframes float-3 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: translate(-20px, -10px) scale(1.1);
              opacity: 1;
            }
          }

          @keyframes float-4 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.4;
            }
            50% {
              transform: translate(10px, -25px) scale(1.4);
              opacity: 0.8;
            }
          }

          @keyframes bounce-gentle {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes wiggle {
            0%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-3deg);
            }
            75% {
              transform: rotate(3deg);
            }
          }

          @keyframes gradient-x {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes progress {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0);
            }
          }

          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-shine {
            animation: shine 3s infinite;
          }

          .animate-float-1 {
            animation: float-1 4s ease-in-out infinite;
          }

          .animate-float-2 {
            animation: float-2 5s ease-in-out infinite;
          }

          .animate-float-3 {
            animation: float-3 6s ease-in-out infinite;
          }

          .animate-float-4 {
            animation: float-4 4.5s ease-in-out infinite;
          }

          .animate-bounce-gentle {
            animation: bounce-gentle 3s ease-in-out infinite;
          }

          .animate-wiggle {
            animation: wiggle 2s ease-in-out infinite;
          }

          .animate-gradient-x {
            background-size: 200% auto;
            animation: gradient-x 3s ease infinite;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }

          .animate-progress {
            animation: progress 3s ease-in-out infinite;
          }

          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

// ============================================
// VERSION ALTERNATIVE : Style Minimal
// ============================================

export function MinimalPromoBanner({ user }: AnimatedPromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!user && isVisible) {
    return (
      <div className="relative bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 overflow-hidden">
        {/* Effet de vague animée */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IndoaXRlIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] animate-drift"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm md:text-base text-white font-medium">
              <span className="animate-pulse">✨</span>
              <Link
                href="/users/ui/login"
                className="ml-2 underline hover:no-underline font-bold hover:text-yellow-300 transition-colors"
              >
                Inscrivez-vous
              </Link>
              <span className="ml-2">et économisez jusqu'à 20% !</span>
            </p>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes drift {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(40px);
            }
          }

          .animate-drift {
            animation: drift 20s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

// ============================================
// VERSION : Style Néon
// ============================================

export function NeonPromoBanner({ user }: AnimatedPromoBannerProps) {
  if (!user) {
    return (
      <div className="relative bg-gray-900 border-t border-b border-purple-500/50 overflow-hidden">
        {/* Effet néon pulsant */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse-slow"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-sm md:text-base">
            <span className="neon-text text-xl font-black">
              ⚡ OFFRE SPÉCIALE ⚡
            </span>
            <br className="sm:hidden" />
            <Link
              href="/users/ui/login"
              className="ml-2 neon-text-link text-green-600 font-bold hover:scale-110 inline-block transition-transform"
            >
              Créez votre compte
            </Link>
            <span className="text-gray-300 ml-2">
              pour des réductions exclusives !
            </span>
          </p>
        </div>

        <style jsx>{`
          .neon-text {
            color: #fff;
            text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00ff,
              0 0 30px #ff00ff, 0 0 40px #ff00ff;
            animation: neon-flicker 1.5s infinite alternate;
          }

          .neon-text-link {
            color: #0ff;
            text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff,
              0 0 30px #0ff;
          }

          @keyframes neon-flicker {
            0%,
            19%,
            21%,
            23%,
            25%,
            54%,
            56%,
            100% {
              opacity: 1;
            }
            20%,
            24%,
            55% {
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}
