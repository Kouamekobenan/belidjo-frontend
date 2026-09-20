"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers, ShoppingCart, Store } from "lucide-react";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import { GetProductsByCategoryUseCase } from "@/app/products/application/usecases/get-products-by-category.usecase";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";

const repo = new ProductRepository(new ProductMapper());
const getProductsByCategory = new GetProductsByCategoryUseCase(repo);
const PAGE_SIZE = 20;

export default function CategoryProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: categoryId } = use(params);
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name") || "Catégorie";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProductsByCategory
      .execute(categoryId, pagination.page, PAGE_SIZE)
      .then((res) => {
        setProducts(res.data);
        setPagination({ page: res.page, totalPages: res.totalPages, total: res.total });
      })
      .catch(() => setError("Échec du chargement des articles de cette catégorie."))
      .finally(() => setLoading(false));
  }, [categoryId, pagination.page]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="py-8 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/vendor"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-green-600 mb-2"
            >
              <ChevronLeft size={14} /> Retour au catalogue
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {categoryName}
            </h1>
            {!loading && (
              <p className="text-sm text-slate-400 mt-1">
                {pagination.total} article{pagination.total > 1 ? "s" : ""} disponible
                {pagination.total > 1 ? "s" : ""}, tous vendeurs confondus
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-20 text-center">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Layers className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 font-bold">
              Aucun article disponible dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30 hover:shadow-md transition-shadow"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-4 font-black text-slate-400">
              {pagination.page} / {pagination.totalPages}
            </div>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30 hover:shadow-md transition-shadow"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: IProduct }) {
  const detailUrl = `/products/ui/pages/page/${product.id}?action=order`;
  const vendorName = product.vendor?.user?.name;

  return (
    <Link
      href={detailUrl}
      className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex flex-col"
    >
      <div className="relative bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-green-600/20 overflow-hidden flex-shrink-0 aspect-square w-full p-3 md:p-4">
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-3 md:p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-semibold text-slate-800 text-xs md:text-sm line-clamp-2 leading-tight mb-1 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          {vendorName && (
            <p className="inline-flex items-center gap-1 text-[10px] md:text-xs font-medium text-slate-400 mt-0.5">
              <Store size={11} /> {vendorName}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-green-600 font-black text-xs md:text-base tracking-tight">
            {product.price.toLocaleString()}{" "}
            <span className="text-[9px] md:text-xs font-bold text-slate-400">FCFA</span>
          </p>

          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
            <ShoppingCart size={12} />
            Commander
          </span>
        </div>
      </div>
    </Link>
  );
}
