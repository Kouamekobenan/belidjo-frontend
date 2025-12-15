"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
// Importez vos UseCases et Entités existants
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { GetProductsByVendorUseCase } from "@/app/products/application/usecases/get-product.usecase";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import { deleteProductUseCase } from "@/app/products/application/usecases/delete-poduct.usecase";
import toast from "react-hot-toast";

// --- Configuration et Chemins ---
const repo = new ProductRepository(new ProductMapper());
const getProducts = new GetProductsByVendorUseCase(repo);

const PRODUCT_DETAIL_BASE_PATH = "/products";
const PRODUCT_CREATE_PATH = "/admin/products/create";
const PRODUCT_EDIT_BASE_PATH = "/admin/products/edith";

// 💡 SIMULATION du UseCase de Suppression (comme dans la version précédente)

// --- Composant Principal ---

export default function VendorProductList({ vendorId }: { vendorId: string }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { handleDelete } = deleteProductUseCase();

  // --- Logique de Données et CRUD (inchangée) ---

  const fetchProducts = (page: number) => {
    setLoading(true);
    setError(null);
    getProducts
      .execute(vendorId, 10, page)
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
  };

  useEffect(() => {
    fetchProducts(pagination.page);
  }, [vendorId, pagination.page]);

  const handleDeleteProduct = async (productId: string) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
      )
    ) {
      return;
    }

    setDeletingId(productId);
    try {
      await handleDelete(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
      if (products.length === 1 && pagination.page > 1) {
        handlePageChange(pagination.page - 1);
      }
      toast.success(`Produit ${productId} supprimé avec succès.`);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Échec de la suppression du produit. Veuillez réessayer.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditProduct = (productId: string) => {
    window.location.href = `${PRODUCT_EDIT_BASE_PATH}/${productId}`;
  };

  // --- Fonctions de Pagination (inchangées) ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handlePreviousPage = () => handlePageChange(pagination.page - 1);
  const handleNextPage = () => handlePageChange(pagination.page + 1);
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { page, totalPages } = pagination;
    // (Logique de pagination... inchangée)
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  // ---------------------------------------------

  // --- Rendu des États (Erreur/Vide) ---
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
        {/* ... Message Aucun produit ... */}
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
          Aucun produit disponible 
        </h3>
        <p className="text-gray-500 text-base">
          Vous n'avez pas encore ajouté de produits. Commencez par en **créer**
          un !
        </p>
        <Link
          href={PRODUCT_CREATE_PATH}
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition duration-150"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Créer mon premier produit
        </Link>
      </div>
    );
  }

  // --- Composants de Statut (Stock) ---
  const StockStatus = ({ quantity }: { quantity: number }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        quantity > 10
          ? "bg-green-100 text-green-700"
          : quantity > 0
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {quantity > 0 ? `${quantity} en stock` : "Épuisé"}
    </span>
  );

  // --- Composant des Boutons d'Action (Réutilisable) ---
  const ActionButtons = ({ productId }: { productId: string }) => {
    const isDeleting = deletingId === productId;
    return (
      <div className="flex space-x-2">
        {/* Bouton Modifier */}
        <button
          onClick={() => handleEditProduct(productId)}
          className="p-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Modifier"
          disabled={isDeleting}
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        {/* Bouton Supprimer */}
        <button
          onClick={() => handleDeleteProduct(productId)}
          className={`p-2 border border-transparent text-sm font-medium rounded-lg text-white ${
            isDeleting
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          title={isDeleting ? "Suppression..." : "Supprimer"}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>
    );
  };
  // ---------------------------------------------

  // --- Rendu Principal ---

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* En-tête du Dashboard Vendeur */}
        <header className="flex flex-col gap-4 sm:flex-row justify-between items-center mb-8 p-6 bg-white shadow-xl rounded-2xl border border-cyan-100">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
            Catalogue de Produits Vendeur
          </h1>
          <Link
            href={PRODUCT_CREATE_PATH}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-teal-600 hover:bg-teal-700 transition duration-300 transform hover:scale-[1.03]"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Créer un nouveau produit
          </Link>
        </header>

        {/* Skeleton Loader (Adapté pour la vue Tableau/Liste) */}
        {loading ? (
          // Placeholder simple pour le chargement
          <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            {/* --- Vue Tableau (Écrans Large - lg: ) --- */}
            <div className="hidden lg:block bg-white shadow-xl rounded-2xl overflow-hidden mb-12 border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                      >
                        Image
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nom du Produit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                      >
                        Prix (FCFA)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                      >
                        Stock
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`}
                            title="Voir le détail public"
                          >
                            <img
                              className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                              src={p.imageUrl}
                              alt={p.name}
                            />
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                          <Link
                            href={`${PRODUCT_EDIT_BASE_PATH}/${p.id}`}
                            className="hover:text-cyan-600 transition duration-150"
                          >
                            {p.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-teal-600">
                          {p.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StockStatus quantity={p.quantity} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ActionButtons productId={p.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* --- Vue Cartes (Écrans Small/Medium - < lg) --- */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {products.map((p) => {
                const detailLink = `${PRODUCT_DETAIL_BASE_PATH}/ui/pages/page/${p.id}`;
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col"
                  >
                    <Link href={detailLink} className="flex-grow">
                      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {p.name}
                        </h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-extrabold text-teal-600">
                            {p.price.toLocaleString()} FCFA
                          </span>
                        </div>
                        <div className="mt-2">
                          <StockStatus quantity={p.quantity} />
                        </div>
                      </div>
                    </Link>

                    {/* Boutons d'action dans la vue carte */}
                    <div className="p-4 pt-0 border-t border-gray-100 flex justify-between gap-3">
                      <button
                        onClick={() => handleEditProduct(p.id)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
                        disabled={deletingId === p.id}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className={`flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg text-white ${
                          deletingId === p.id
                            ? "bg-red-400"
                            : "bg-red-600 hover:bg-red-700"
                        } transition`}
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id ? "Suppr..." : "Supprimer"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center gap-2 mt-8 pb-8">
                  {/* ... Pagination (inchangée) ... */}
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
                      if (pageNum === "...")
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-gray-400"
                          >
                            ...
                          </span>
                        );
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
                {/* Informations de pagination */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  Page {pagination.page} sur {pagination.totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
