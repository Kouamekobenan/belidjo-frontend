import { useEffect, useState } from "react";
import Link from "next/link";
import { IProduct } from "../../domain/entities/product.entity";
import { GetProductsByVendorUseCase } from "../../application/usecases/get-product.usecase";
import { ProductRepository } from "../../infrastructure/product-repository";
import { ProductMapper } from "../../domain/mappers/product.mapper";
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

const repo = new ProductRepository(new ProductMapper());
const getProducts = new GetProductsByVendorUseCase(repo);
const PRODUCT_DETAIL_BASE_PATH = "/products";

export default function VendorProducts({ vendorId }: { vendorId: string }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts
      .execute(vendorId, 10, pagination.page)
      .then((res) => {
        setProducts(res.data);
        setPagination({ page: res.page, totalPages: res.totalPages });
        setLoading(false);
      })
      .catch((err) => {
        setError("Échec du chargement des produits.");
        setLoading(false);
      });
  }, [vendorId, pagination.page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  if (error)
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-3xl border border-red-100 text-red-600 max-w-xl mx-auto mt-20">
        <Info className="w-12 h-12 mb-4" />
        <p className="text-lg font-bold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm underline font-medium"
        >
          Réessayer
        </button>
      </div>
    );

  if (!loading && products.length === 0)
    return (
      <div className="text-center py-24 bg-white rounded-[32px] shadow-sm border border-gray-100 max-w-4xl mx-auto mt-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-3">
          Boutique vide
        </h3>
        <p className="text-slate-500 max-w-xs mx-auto">
          Ce vendeur n'a pas encore exposé ses articles. Revenez bientôt !
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-4 md:pb-20">
      <div className="max-w-7xl mx-auto lg:px-8">
        {/* Header de section */}
        <div className="py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Nos Articles
            </h2>
            <p className="text-slate-500 font-medium">
              Découvrez les pépites de notre collection
            </p>
          </div>
          <div className="h-1 w-20 bg-teal-500 rounded-full hidden md:block"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl h-[350px] animate-pulse border border-gray-100"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="group relative bg-white rounded-[24px] p-2 md:p-3 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-transparent hover:border-teal-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <Link
                    href={`${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`}
                    className="relative aspect-[4/5] rounded-[18px] overflow-hidden bg-slate-100 block"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  {/* Détails */}
                  <div className="mt-4 px-1 pb-2 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors">
                        {p.name}
                      </h3>
                    </div>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 line-through decoration-red-400/30">
                          {(p.price * 1.2).toLocaleString()}
                        </span>
                        <span className="text-lg md:text-xl font-black text-teal-600">
                          {p.price.toLocaleString()}{" "}
                          <span className="text-[10px] ml-0.5">FCFA</span>
                        </span>
                      </div>
                      <Link
                        href={`${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`}
                        className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-teal-500 transition-colors shadow-lg shadow-slate-200"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Designée */}
            {pagination.totalPages > 1 && (
              <div className="mt-20 flex flex-col items-center gap-6">
                <div className="flex items-center p-2 bg-white rounded-2xl shadow-sm border border-slate-100 w-fit">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 md:p-3 rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-colors text-slate-600"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center px-2">
                    {/* Logique simplified des numéros de page pour le design */}
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const n = i + 1;
                      const active = n === pagination.page;
                      return (
                        <button
                          key={n}
                          onClick={() => handlePageChange(n)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl text-sm font-bold transition-all ${
                            active
                              ? "bg-teal-500 text-white shadow-lg shadow-teal-200 scale-110"
                              : "text-slate-400 hover:text-slate-900"
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 md:p-3 rounded-xl disabled:opacity-20 hover:bg-slate-50 transition-colors text-slate-600"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Page {pagination.page}{" "}
                  <span className="mx-2 text-slate-200">|</span> Total{" "}
                  {pagination.totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
