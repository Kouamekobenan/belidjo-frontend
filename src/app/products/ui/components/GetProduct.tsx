import { useEffect, useState } from "react";
import Link from "next/link";
// Assurez-vous que cette entité inclut 'id' et 'comment' (avec l'interface IComment)
import { IProduct } from "../../domain/entities/product.entity";
import { GetProductsByVendorUseCase } from "../../application/usecases/get-product.usecase";
import { ProductRepository } from "../../infrastructure/product-repository";

// --- Configuration de la Logique Métier ---
const repo = new ProductRepository();
const getProducts = new GetProductsByVendorUseCase(repo);
// Le chemin de votre page de détail du produit est supposé être `/products/[id]`
const PRODUCT_DETAIL_BASE_PATH = "/products"; // Ajustez si votre chemin est différent (ex: '/pages/page')
// --- Composant Principal ---

export default function VendorProducts({ vendorId }: { vendorId: string }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État pour la bascule des commentaires
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
      .execute(vendorId, 10, pagination.page)
      .then((res) => {
        const mappedProducts: IProduct[] = res.data.map((product: any) => ({
          ...product,
          // S'assurer d'utiliser 'comments' ou 'comment' si le backend varie
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
  }, [vendorId, pagination.page]);

  // Fonctions de navigation de pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      // Scroll vers le haut pour une meilleure UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    handlePageChange(pagination.page - 1);
  };
  const handleNextPage = () => {
    handlePageChange(pagination.page + 1);
  };
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 7) {
      // Si 7 pages ou moins, afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      // Pages autour de la page actuelle
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      // Toujours afficher la dernière page
      pages.push(totalPages);
    }

    return pages;
  };

  // --- Rendu des États (Chargement/Erreur/Vide) ---

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-xl mx-auto mt-10">
        <p className="font-semibold">⚠️ Erreur : {error}</p>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-7xl mx-auto mt-6">
        <div className="inline-block p-5 bg-cyan-50 rounded-full mb-5">
          <svg
            className="w-12 h-12 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
          Aucun produit disponible 😔
        </h3>
        <p className="text-gray-500 text-base">
          Ce vendeur n'a pas encore ajouté de produits.
        </p>
      </div>
    );
  }

  // --- Rendu du Composant ---

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Skeleton Loader (amélioré pour un affichage propre) */}
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
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {products.map((p) => {
                // IMPORTANT : Utilisez p.comments ou p.comment de manière cohérente
                const productComments = p.comment || p.comment || [];
                const isShowingAll = showAllComments[p.id];
                const commentsToShow = isShowingAll
                  ? productComments
                  : productComments.slice(0, 1);

                // Définir la destination du lien (route dynamique)
                const detailLink = `${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`;

                return (
                  // Utiliser Link pour englober la carte entière rend la carte cliquable
                  <div
                    key={p.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border border-gray-100 flex flex-col"
                  >
                    <Link href={detailLink} className="flex-grow">
                      {/* Image du produit */}
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
                        {/* Titre du produit - Le lien est déjà appliqué via le Link parent */}
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
                    {/* Nouvelle section pour les boutons d'action et les commentaires */}
                    <div className="p-4 pt-0">
                      {/* Bouton Voir les détails */}
                      <Link
                        href={detailLink}
                        className="block w-full text-center py-2 text-sm font-semibold rounded-lg bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors duration-300 mb-4 border border-cyan-200"
                      >
                        Voir les détails (voir +)
                      </Link>

                      {/* Section Commentaires */}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-center gap-1 mb-2">
                          <svg
                            className="w-4 h-4 text-cyan-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
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

            {/* Section Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pb-8">
                {/* Bouton Précédent */}
                <button
                  onClick={handlePreviousPage}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    pagination.page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-cyan-600 hover:bg-cyan-50 border border-cyan-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Précédent</span>
                </button>
                {/* Numéros de page */}
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
                {/* Bouton Suivant */}
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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Informations de pagination */}
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
