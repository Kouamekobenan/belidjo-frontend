"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import { useParams } from "next/navigation";
import { FindProductByCatIdUseCase } from "@/app/products/application/usecases/find-all-cat.usecases";
import VendorNavBar from "@/app/components/layout/Vendor-NavBar";
import {
  ShoppingBag,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Configuration de la Logique Métier ---
const repo = new ProductRepository();
const getProducts = new FindProductByCatIdUseCase(repo);
const PRODUCT_DETAIL_BASE_PATH = "/products";

export default function VendorProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id as string;

  const [showAllComments, setShowAllComments] = useState<{
    [productId: string]: boolean;
  }>({});

  const toggleComments = (productId: string) => {
    setShowAllComments((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts
      .execute(id, 10, pagination.page)
      .then((res) => {
        const mappedProducts: IProduct[] = res.data.map((product: any) => ({
          ...product,
          comments: product.comment || product.comments || [],
        }));
        setProducts(mappedProducts);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des produits:", err);
        setError("Échec du chargement des produits. Veuillez réessayer.");
        setLoading(false);
      });
  }, [id, pagination.page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    handlePageChange(pagination.page - 1);
  };

  const handleNextPage = () => {
    handlePageChange(pagination.page + 1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VendorNavBar />
        <div className="text-center p-8 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-xl mx-auto mt-10">
          <p className="font-semibold">⚠️ Erreur : {error}</p>
        </div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VendorNavBar />
        <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-7xl mx-auto mt-6">
          <div className="inline-block p-5 bg-cyan-50 rounded-full mb-5">
            <ShoppingBag className="w-12 h-12 text-cyan-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
            Aucun produit disponible 😔
          </h3>
          <p className="text-gray-500 text-base">
            Ce vendeur n'a pas encore ajouté de produits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavBar />

      <div className="max-w-7xl mx-auto p-4 md:p-12 mt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse border border-gray-100"
              >
                <div className="w-full h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-2/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {products.map((p) => {
                const productComments = p.comment || p.comment || [];
                const isShowingAll = showAllComments[p.id];
                const commentsToShow = isShowingAll
                  ? productComments
                  : productComments.slice(0, 1);

                const detailLink = `${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`;

                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border border-gray-100 flex flex-col"
                  >
                    <Link href={detailLink} className="flex-grow">
                      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                        {p.quantity <= 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white font-extrabold text-base tracking-wider px-2 py-1 bg-red-600 rounded-md">
                              RUPTURE DE STOCK
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-cyan-600 transition-colors duration-300">
                          {p.name}
                        </h3>

                        <div className="flex items-end justify-between mb-3 mt-auto">
                          <span className="text-xl font-extrabold text-teal-600">
                            {p.price.toLocaleString()}{" "}
                            <span className="text-xs font-semibold text-gray-500">
                              FCFA
                            </span>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              p.quantity > 10
                                ? "bg-green-100 text-green-700"
                                : p.quantity > 0
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {p.quantity > 0
                              ? `${p.quantity} en stock`
                              : "Épuisé"}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-4 pt-0">
                      <Link
                        href={detailLink}
                        className="block w-full text-center py-2 text-sm font-semibold rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors duration-300 mb-4 border border-cyan-200"
                      >
                        Voir les détails (voir +)
                      </Link>

                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-center gap-1 mb-2">
                          <MessageCircle className="w-4 h-4 text-cyan-500" />
                          <span className="text-xs font-semibold text-gray-700">
                            Commentaires ({productComments.length})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pb-8">
                <button
                  onClick={handlePreviousPage}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    pagination.page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-cyan-600 hover:bg-cyan-50 border border-cyan-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Précédent</span>
                </button>

                <div className="flex items-center gap-2">
                  {getPageNumbers().map((pageNum, index) => {
                    if (pageNum === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-3 py-2 text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive = pageNum === pagination.page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum as number)}
                        className={`min-w-[2.5rem] h-10 rounded-lg font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-110"
                            : "bg-white text-gray-700 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300 shadow-sm"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    pagination.page === pagination.totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-cyan-600 hover:bg-cyan-50 border border-cyan-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="text-center text-sm text-gray-600 mt-4">
                Page {pagination.page} sur {pagination.totalPages}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
