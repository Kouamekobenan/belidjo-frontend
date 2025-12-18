"use client";
import { useEffect, useState } from "react";

export const AnimatedHeroTitle = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative max-w-full overflow-hidden px-2">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight break-words">
        {/* Partie 1: "NoBoutik!" avec effet de gradient animé */}
        <span
          className={`
            inline-block
            bg-gradient-to-r from-teal-500 via-green-500 to-pink-600 
            bg-clip-text text-transparent
            animate-gradient-x
            transform transition-all duration-1000
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
          `}
          style={{
            backgroundSize: "200% auto",
          }}
        >
          NoBoutik!
        </span>

        {/* Élément décoratif - Sparkle */}
        <span className="inline-block ml-2 animate-pulse">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400 animate-spin-slow"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>

        <br />

        {/* Partie 2: Slogan avec effet de typing */}
        <span
          className={`
            inline-block
            text-white
            transform transition-all duration-1000 delay-300
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
          `}
        >
          <span className="relative">
            <span className="absolute inset-0 bg-yellow-200/30 transform -skew-x-12 animate-pulse-slow"></span>
            <span className="relative z-10">Fais tes achats </span>
          </span>
          <span className="relative inline-block">
            <span className="text-teal-400 font-extrabold animate-bounce-subtle">
              en un clic
            </span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-600 transform origin-left scale-x-0 animate-underline"></span>
          </span>
        </span>

        {/* Icône de clic animée */}
        <span className="inline-block ml-2 sm:ml-3 animate-click">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        </span>
      </h1>

      {/* Particules décoratives - cachées sur mobile */}
      <div className="hidden sm:block absolute -top-10 -left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-float"></div>
      <div className="hidden sm:block absolute top-0 -right-10 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-float-delayed"></div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes underline {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        @keyframes click {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(-15px);
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
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-underline {
          animation: underline 1s ease-out 1s forwards;
        }
        .animate-click {
          animation: click 1.5s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
