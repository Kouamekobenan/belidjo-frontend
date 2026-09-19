"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  ChevronRight,
  User,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export interface VendorOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: "Wave" | "Orange Money" | "MTN MoMo" | "Cash";
  status: "En attente" | "En cours" | "Livrée" | "Annulée";
  createdAt: string;
}

// Données simulées typiques pour le tableau de bord vendeur
const MOCK_ORDERS: VendorOrder[] = [
  {
    id: "ord-1",
    orderNumber: "#ORD-9482",
    customerName: "Kouassi Jean-Marc",
    customerPhone: "+225 07 48 92 10",
    itemsCount: 3,
    totalAmount: 24500,
    paymentMethod: "Wave",
    status: "En cours",
    createdAt: "Aujourd'hui, 14:32",
  },
  {
    id: "ord-2",
    orderNumber: "#ORD-9481",
    customerName: "Awa Diabate",
    customerPhone: "+225 05 06 11 44",
    itemsCount: 1,
    totalAmount: 12000,
    paymentMethod: "Orange Money",
    status: "Livrée",
    createdAt: "Aujourd'hui, 11:15",
  },
  {
    id: "ord-3",
    orderNumber: "#ORD-9480",
    customerName: "Yao Konan Patrick",
    customerPhone: "+225 01 02 88 99",
    itemsCount: 5,
    totalAmount: 48000,
    paymentMethod: "MTN MoMo",
    status: "En attente",
    createdAt: "Hier, 18:40",
  },
  {
    id: "ord-4",
    orderNumber: "#ORD-9479",
    customerName: "Bamba Mariam",
    customerPhone: "+225 07 55 43 21",
    itemsCount: 2,
    totalAmount: 18500,
    paymentMethod: "Cash",
    status: "Livrée",
    createdAt: "Hier, 15:20",
  },
];

export const VendorRecentOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"toutes" | "encours" | "livrees">("toutes");

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (activeTab === "encours") return order.status === "En cours" || order.status === "En attente";
    if (activeTab === "livrees") return order.status === "Livrée";
    return true;
  });

  const getPaymentBadge = (method: VendorOrder["paymentMethod"]) => {
    switch (method) {
      case "Wave":
        return "bg-cyan-500 text-white font-bold";
      case "Orange Money":
        return "bg-orange-500 text-white font-bold";
      case "MTN MoMo":
        return "bg-yellow-400 text-slate-900 font-bold";
      case "Cash":
        return "bg-emerald-600 text-white font-bold";
      default:
        return "bg-slate-700 text-white";
    }
  };

  const getStatusBadge = (status: VendorOrder["status"]) => {
    switch (status) {
      case "Livrée":
        return {
          label: "Livrée",
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
        };
      case "En cours":
        return {
          label: "En livraison",
          bg: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Truck,
        };
      case "En attente":
        return {
          label: "En attente",
          bg: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Clock,
        };
      default:
        return {
          label: status,
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          icon: Clock,
        };
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            Commandes Récentes & Livraisons
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des ventes et livraisons des clients
          </p>
        </div>

        {/* Onglets de filtrage */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("toutes")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "toutes"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setActiveTab("encours")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "encours"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setActiveTab("livrees")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "livrees"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Livrées
          </button>
        </div>
      </div>

      {/* Table responsive */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="pb-3 pl-2">Commande</th>
              <th className="pb-3">Client</th>
              <th className="pb-3">Paiement</th>
              <th className="pb-3">Montant</th>
              <th className="pb-3">Statut</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const StatusIcon = statusInfo.icon;
              return (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="font-bold text-slate-900">{order.orderNumber}</div>
                    <div className="text-[10px] text-slate-400">{order.createdAt}</div>
                  </td>
                  <td className="py-3.5">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {order.customerName}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[10px] ${getPaymentBadge(
                        order.paymentMethod
                      )}`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-slate-900">
                      {order.totalAmount.toLocaleString("fr-FR")} FCFA
                    </span>
                    <div className="text-[10px] text-slate-400">{order.itemsCount} article(s)</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.bg}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400">Affichage des dernières commandes client</span>
        <Link
          href="/admin/products"
          className="font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
        >
          <span>Gérer l&apos;inventaire</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default VendorRecentOrders;
