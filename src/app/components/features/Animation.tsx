"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Gift, TrendingUp, X, ChevronRight, Zap } from "lucide-react";

interface AnimatedPromoBannerProps {
  user?: any;
}

export default function AnimatedPromoBanner({
  user,
}: AnimatedPromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animation d'entrée progressive
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

  // Retourner null si pas visible pour retirer complètement du DOM
  if (!isVisible) {
    return null;
  }

  // if (!user || !isVisible) {
  //   return null;
  // }

  return (
    <>
      <div
        className={`
          relative overflow-hidden
          bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50
          border-y border-emerald-200/60
          shadow-lg
          transform transition-all duration-500 ease-out
          ${
            isAnimating
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }
        `}
      >
        {/* Effet de brillance diagonal animé */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="banner-shine"></div>
        </div>

        {/* Particules décoratives flottantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>

        {/* Contenu principal */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Icône animée avec effet glow */}
            <div className="flex-shrink-0 hidden sm:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur-lg opacity-60 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-2.5 rounded-full shadow-xl icon-float">
                  <Gift className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Contenu textuel */}
            <div className="flex-1 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                {/* Badge offre exclusive */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-full shadow-lg badge-wiggle">
                  <Sparkles className="w-3 h-3 sparkle-spin" />
                  <span>Offre Exclusive</span>
                  <Zap className="w-3 h-3" />
                </span>

                {/* Message principal */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <span className="text-gray-700 font-medium">
                    Inscrivez-vous sur
                  </span>

                  <Link
                    href="/users/ui/login"
                    className="group relative inline-flex items-center font-bold"
                  >
                    <span className="relative text-emerald-600 hover:text-emerald-700 transition-colors">
                      NoBoutik
                      {/* Soulignement animé */}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-cyan-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    </span>
                    <ChevronRight className="w-4 h-4 ml-0.5 text-emerald-600 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <span className="text-gray-700 font-medium hidden sm:inline">
                    et profitez de
                  </span>

                  {/* Badge réduction */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-black rounded-full shadow-md discount-pulse">
                    <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
                    -20%
                  </span>

                  <span className="text-gray-700 font-medium">
                    de réduction !
                  </span>
                </div>
              </div>

              {/* Texte secondaire mobile */}
              <p className="mt-1.5 text-[10px] text-gray-600 sm:hidden">
                Valable sur votre première commande
              </p>
            </div>

            {/* Bouton de fermeture élégant */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-200/60 active:bg-gray-300/60 transition-all duration-200 group"
              aria-label="Fermer la bannière"
            >
              <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          {/* Barre de progression (temps limité) */}
          <div className="mt-3 w-full h-1 bg-gray-200/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 progress-bar"></div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        /* ===== ANIMATIONS PRINCIPALES ===== */

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(var(--float-x), var(--float-y)) scale(1.2);
            opacity: 1;
          }
        }

        @keyframes icon-float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(5deg);
          }
        }

        @keyframes badge-wiggle {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(-2deg) scale(1.02);
          }
          75% {
            transform: rotate(2deg) scale(1.02);
          }
        }

        @keyframes sparkle-spin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes discount-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
          }
        }

        @keyframes progress-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        /* ===== CLASSES D'ANIMATION ===== */

        .banner-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: translateX(-100%) skewX(-15deg);
          animation: shine 4s ease-in-out infinite;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .particle-1 {
          top: 20%;
          left: 15%;
          width: 8px;
          height: 8px;
          background: rgba(16, 185, 129, 0.4);
          --float-x: -12px;
          --float-y: -18px;
          animation: float 4s ease-in-out infinite;
        }

        .particle-2 {
          top: 50%;
          left: 40%;
          width: 6px;
          height: 6px;
          background: rgba(6, 182, 212, 0.5);
          --float-x: 15px;
          --float-y: -22px;
          animation: float 5s ease-in-out infinite 0.5s;
        }

        .particle-3 {
          top: 70%;
          right: 25%;
          width: 7px;
          height: 7px;
          background: rgba(20, 184, 166, 0.4);
          --float-x: -18px;
          --float-y: -15px;
          animation: float 6s ease-in-out infinite 1s;
        }

        .particle-4 {
          top: 30%;
          right: 35%;
          width: 5px;
          height: 5px;
          background: rgba(34, 197, 94, 0.6);
          --float-x: 10px;
          --float-y: -25px;
          animation: float 4.5s ease-in-out infinite 1.5s;
        }
        .particle-5 {
          top: 60%;
          left: 70%;
          width: 6px;
          height: 6px;
          background: rgba(14, 165, 233, 0.5);
          --float-x: -14px;
          --float-y: -20px;
          animation: float 5.5s ease-in-out infinite 2s;
        }

        .icon-float {
          animation: icon-float 3s ease-in-out infinite;
        }

        .badge-wiggle {
          animation: badge-wiggle 2.5s ease-in-out infinite;
        }

        .sparkle-spin {
          animation: sparkle-spin 4s linear infinite;
        }

        .discount-pulse {
          animation: discount-pulse 2s ease-in-out infinite;
        }

        .progress-bar {
          animation: progress-bar 4s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        /* ===== RESPONSIVE OPTIMIZATIONS ===== */

        @media (max-width: 640px) {
          .particle {
            width: 4px !important;
            height: 4px !important;
          }
        }
      `}</style>
    </>
  );
}
