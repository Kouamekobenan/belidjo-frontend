"use client";

import React from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from "lucide-react";

interface MetricsProps {
  totalRevenue: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  totalProductsCount: number;
  totalStockValue: number;
  lowStockCount: number;
  periodLabel: string;
}

export const VendorMetricsOverview: React.FC<MetricsProps> = ({
  totalRevenue,
  totalOrdersCount,
  averageOrderValue,
  totalProductsCount,
  totalStockValue,
  lowStockCount,
  periodLabel,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Chiffre d'affaires */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-lg border border-gray-700/60 overflow-hidden group hover:shadow-xl transition-all">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all" />
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +14.2%
          </span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
          Chiffre d&apos;Affaires Estimé
        </p>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {totalRevenue.toLocaleString("fr-FR")} <span className="text-sm font-bold text-green-400">FCFA</span>
        </h3>
        <p className="text-[11px] text-gray-400 mt-2">Période : {periodLabel}</p>
      </div>

      {/* 2. Commandes Totales & Panier Moyen */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
            <TrendingUp className="w-3.5 h-3.5" />
            +8.5%
          </span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          Commandes Réalisées
        </p>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
          {totalOrdersCount} <span className="text-xs font-medium text-slate-500">commandes</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-2 font-medium">
          Panier Moyen : <span className="font-bold text-slate-800">{averageOrderValue.toLocaleString("fr-FR")} FCFA</span>
        </p>
      </div>

      {/* 3. Valeur & Unités de Stock */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Package className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600">
            <Layers className="w-3.5 h-3.5" />
            {totalProductsCount} Réf.
          </span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          Valeur Totale du Stock
        </p>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
          {totalStockValue.toLocaleString("fr-FR")} <span className="text-xs font-medium text-slate-500">FCFA</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-2 font-medium">
          En rayon dans votre boutique
        </p>
      </div>

      {/* 4. Alertes de Stock */}
      <div className={`p-6 rounded-3xl shadow-sm border transition-all ${lowStockCount > 0 ? "bg-orange-50/70 border-orange-200 ring-2 ring-orange-200/50" : "bg-white border-slate-100"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${lowStockCount > 0 ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-emerald-50 text-emerald-600"}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          {lowStockCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-200 text-orange-800 animate-pulse">
              Attention
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              Stock Optimal
            </span>
          )}
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          Ruptures Proches (&lt; 5 en stock)
        </p>
        <h3 className={`text-2xl sm:text-3xl font-black ${lowStockCount > 0 ? "text-orange-900" : "text-slate-900"}`}>
          {lowStockCount} <span className="text-xs font-medium text-slate-500">produits concernés</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-2 font-medium">
          {lowStockCount > 0 ? "Réapprovisionnez vite vos articles" : "Tous vos articles ont un stock suffisant"}
        </p>
      </div>
    </div>
  );
};

export default VendorMetricsOverview;
