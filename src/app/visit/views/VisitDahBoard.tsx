"use client";
import React, { useEffect, useState, useMemo } from "react";
import { VisitRepository } from "../infrastruture/visit.repository";
import { GetVendorDashboardStatsUseCase } from "../application/usecases/getDashbord-visit.usecase";
import { Result } from "../domain/interfaces/visit.repository";
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Loader2,
  Eye,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function DashBordVisitAdmin({ vendorId }: { vendorId: string }) {
  const [visit, setVisit] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({
    today: 0,
    week: 0,
    total: 0,
  });

  const useCase = useMemo(
    () => new GetVendorDashboardStatsUseCase(new VisitRepository()),
    [],
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const results = await useCase.execute(vendorId);
        setVisit(results);

        // Animation des compteurs
        setTimeout(() => {
          setAnimatedValues({
            today: results?.today.count ?? 0,
            week: results?.thisWeek.count ?? 0,
            total: results?.allTime.count ?? 0,
          });
        }, 100);
      } catch (error) {
        console.error("Erreur stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) fetchStats();
  }, [vendorId, useCase]);

  // Calculs des tendances
  const todayVsYesterday = useMemo(() => {
    if (!visit) return 0;
    const yesterday = visit.thisWeek?.count ?? 0;
    const today = visit.today?.count ?? 0;
    if (yesterday === 0) return today > 0 ? 100 : 0;
    return ((today - yesterday) / yesterday) * 100;
  }, [visit]);

  const weekTrend = useMemo(() => {
    if (!visit) return 0;
    const lastWeek = visit.allTime?.count ?? 0;
    const thisWeek = visit.thisWeek?.count ?? 0;
    if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
    return ((thisWeek - lastWeek) / lastWeek) * 100;
  }, [visit]);

  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-3xl border-2 border-slate-200/50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
        <div className="flex flex-col items-center justify-center h-80 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="relative w-12 h-12 text-teal-500 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse">
            Chargement des statistiques...
          </p>
        </div>
      </div>
    );
  }

  const statsConfig = [
    {
      label: "Aujourd'hui",
      value: animatedValues.today,
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      gradient: "bg-gray-100",
      bgGradient: "from-emerald-50 to-teal-50",
      trend: todayVsYesterday,
      subtitle: "visites du jour",
      accentColor: "emerald",
    },
    {
      label: "Cette Semaine",
      value: animatedValues.week,
      icon: <Calendar className="w-6 h-6 text-green-500" />,
      gradient: "bg-gray-100",
      bgGradient: "from-blue-50 to-indigo-50",
      trend: weekTrend,
      subtitle: "visites sur 7 jours",
      accentColor: "blue",
    },
    {
      label: "Total des Vues",
      value: animatedValues.total,
      icon: <Eye className="w-6 h-6 text-green-500" />,
      gradient: "bg-gray-100",
      bgGradient: "from-purple-50 to-pink-50",
      trend: null,
      subtitle: "depuis le début",
      accentColor: "purple",
    },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête avec titre et badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur-lg opacity-50"></div>
            <div className="relative p-3 bg-gradient-to-br bg-teal-500  rounded-2xl shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text">
              Analyse des performances de votre boutique
            </h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
          <Activity className="w-4 h-4 text-green-600 animate-pulse" />
          <span className="text-sm font-bold text-green-700">En Direct</span>
        </div>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsConfig.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "slideUpFade 0.6s ease-out forwards",
              opacity: 0,
            }}
          >
            {/* Fond dégradé animé */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            ></div>

            {/* Contenu */}
            <div className="relative p-6 sm:p-8">
              {/* Icône et badge */}
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity`}
                  ></div>
                  <div
                    className={`relative p-3.5 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    {stat.icon}
                  </div>
                </div>

                {/* Indicateur de tendance */}
                {stat.trend !== null && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                      stat.trend >= 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.trend >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stat.trend).toFixed(1)}%</span>
                  </div>
                )}
              </div>

              {/* Valeur principale */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <h3
                    className="text-4xl sm:text-5xl font-black text-slate-900 tabular-nums transition-all duration-700"
                    style={{
                      counterReset: `num ${stat.value}`,
                    }}
                  >
                    {stat.value.toLocaleString("fr-FR")}
                  </h3>
                  {stat.trend !== null && stat.trend > 0 && (
                    <TrendingUp className="w-5 h-5 text-green-500 animate-bounce" />
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-700">
                    {stat.label}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {stat.subtitle}
                  </p>
                </div>
              </div>

              {/* Barre de progression décorative */}
              <div className="mt-6 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: `${Math.min((stat.value / (animatedValues.total || 1)) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
