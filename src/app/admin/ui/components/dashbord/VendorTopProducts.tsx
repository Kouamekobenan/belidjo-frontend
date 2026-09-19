"use client";

import React from "react";
import { Award, Package, ArrowUpRight, Sparkles } from "lucide-react";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import Link from "next/link";

interface TopProductsProps {
  products: IProduct[];
}

export const VendorTopProducts: React.FC<TopProductsProps> = ({ products }) => {
  // Sélectionner les 5 produits avec la valeur/quantité maximale
  const sortedProducts = [...products]
    .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
    .slice(0, 5);

  const maxStock = Math.max(...products.map((p) => p.quantity || 1), 1);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Meilleures Ventes</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Top Performers</span>
        </div>

        <div className="space-y-4">
          {sortedProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Aucun produit dans l&apos;inventaire.</p>
          ) : (
            sortedProducts.map((product, index) => {
              const stockPercentage = Math.min(100, Math.round((product.quantity / maxStock) * 100));
              const isLowStock = product.quantity < 5;

              return (
                <div
                  key={product.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</p>
                        <p className="text-[11px] text-green-600 font-bold">
                          {product.price.toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isLowStock
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      Stock: {product.quantity}
                    </span>
                  </div>

                  {/* Jauge de niveau de stock */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLowStock ? "bg-orange-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.max(10, stockPercentage)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400">Basé sur l&apos;activité récente</span>
        <Link href="/admin/products" className="font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
          <span>Voir tout le catalogue</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default VendorTopProducts;
