"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { GetProductsByVendorUseCase } from "@/app/products/application/usecases/get-product.usecase";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import { deleteProductUseCase } from "@/app/products/application/usecases/delete-poduct.usecase";
import toast from "react-hot-toast";
import {
  Package,
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ShoppingBag,
} from "lucide-react";

const repo = new ProductRepository(new ProductMapper());
const getProducts = new GetProductsByVendorUseCase(repo);

const PRODUCT_CREATE_PATH = "/admin/products/create";
const PRODUCT_EDIT_BASE_PATH = "/admin/products/edith";

type StockFilter = "all" | "inStock" | "lowStock" | "outOfStock";
type ViewMode = "table" | "grid";

export default function VendorProductList({ vendorId }: { vendorId: string }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Recherche & Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const { handleDelete } = deleteProductUseCase();

  const fetchProducts = (page: number) => {
    setLoading(true);
    setError(null);
    getProducts
      .execute(vendorId, 50, page)
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
      })
      .catch((err) => {
        console.error("Erreur chargement produits:", err);
        setError("Échec du chargement des produits. Veuillez réessayer.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(pagination.page);
  }, [vendorId, pagination.page]);

  // Supprimer un produit
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer "${productName}" ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    setDeletingId(productId);
    try {
      await handleDelete(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success(`Produit "${productName}" supprimé avec succès.`);
    } catch (err) {
      console.error("Erreur de suppression:", err);
      toast.error("Échec de la suppression du produit.");
    } finally {
      setDeletingId(null);
    }
  };

  // Redirection édition
  const handleEditProduct = (productId: string) => {
    window.location.href = `${PRODUCT_EDIT_BASE_PATH}/${productId}`;
  };

  // Statistiques du catalogue
  const stats = useMemo(() => {
    const totalStockValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalStockUnits = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockCount = products.filter((p) => p.quantity < 5 && p.quantity > 0).length;
    const outOfStockCount = products.filter((p) => p.quantity === 0).length;

    return {
      totalProducts: products.length,
      totalStockValue,
      totalStockUnits,
      lowStockCount,
      outOfStockCount,
    };
  }, [products]);

  // Produits filtrés en temps réel
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (stockFilter === "inStock") return p.quantity >= 5;
      if (stockFilter === "lowStock") return p.quantity > 0 && p.quantity < 5;
      if (stockFilter === "outOfStock") return p.quantity === 0;

      return true;
    });
  }, [products, searchTerm, stockFilter]);

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-red-50 border border-red-200 rounded-3xl text-center text-red-700 shadow-sm">
        <AlertTriangle className="w-10 h-10 mx-auto text-red-500 mb-3" />
        <h3 className="text-lg font-bold">Erreur de chargement</h3>
        <p className="text-sm text-red-600 mt-1">{error}</p>
        <button
          onClick={() => fetchProducts(1)}
          className="mt-4 px-5 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-xs"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ========================================================================= */}
        {/* EN-TÊTE DE PAGE ET STATISTIQUES */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-md shadow-green-500/20">
                <Package className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Gestion des Produits
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Gérez le catalogue, les prix et les stocks de votre boutique sur NoBoutik
            </p>
          </div>

          <Link
            href={PRODUCT_CREATE_PATH}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-600/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 shrink-0 text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Produit</span>
          </Link>
        </div>

        {/* Cartes de statistiques du catalogue */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalogue</span>
              <Package className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.totalProducts}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Articles enregistrés</p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valeur Stock</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              {stats.totalStockValue.toLocaleString("fr-FR")} <span className="text-xs font-bold text-green-600">FCFA</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.totalStockUnits} unités en stock</p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Faible</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600">{stats.lowStockCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Articles &lt; 5 unités</p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ruptures</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-2xl font-black text-red-600">{stats.outOfStockCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Articles épuisés (0 stock)</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BARRE DE RECHERCHE, FILTRES ET BASCULEMENT D'AFFICHAGE */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Recherche */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
            />
          </div>

          {/* Filtres de Stock */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setStockFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                stockFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tous ({products.length})
            </button>

            <button
              onClick={() => setStockFilter("inStock")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                stockFilter === "inStock" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              En Stock
            </button>

            <button
              onClick={() => setStockFilter("lowStock")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                stockFilter === "lowStock" ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Faible (&lt; 5)
            </button>

            <button
              onClick={() => setStockFilter("outOfStock")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                stockFilter === "outOfStock" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              Épuisés (0)
            </button>
          </div>

          {/* Mode d'affichage (Tableau vs Grille) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-900"
              }`}
              title="Vue Tableau"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-900"
              }`}
              title="Vue Grille"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* LISTE PRODUITS : TABLEAU OU GRILLE */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-green-600 mb-3" />
            <p className="text-xs font-bold text-slate-500">Chargement de vos produits...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Aucun produit trouvé</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? "Aucun résultat ne correspond à votre recherche. Essayez d'autres mots-clés."
                : "Vous n'avez pas encore créé de produits dans cette catégorie."}
            </p>
            <Link
              href={PRODUCT_CREATE_PATH}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl text-xs hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un produit</span>
            </Link>
          </div>
        ) : viewMode === "table" ? (

          /* --- MODE TABLEAU PRO --- */
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 pl-6">Produit</th>
                    <th className="py-4">Prix</th>
                    <th className="py-4">Stock</th>
                    <th className="py-4">Valeur Totale</th>
                    <th className="py-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredProducts.map((product) => {
                    const isDeleting = deletingId === product.id;
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Produit (Image + Nom) */}
                        <td className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              {product.imageUrl ? (
                                <Image
                                  src={product.imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-slate-400 bg-slate-100">
                                  {product.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {product.description || "Aucune description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Prix */}
                        <td className="py-4">
                          <span className="font-bold text-slate-900">
                            {product.price.toLocaleString("fr-FR")} FCFA
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                              product.quantity === 0
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : product.quantity < 5
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.quantity === 0
                                  ? "bg-red-500"
                                  : product.quantity < 5
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            {product.quantity > 0 ? `${product.quantity} en stock` : "Épuisé"}
                          </span>
                        </td>

                        {/* Valeur du stock */}
                        <td className="py-4">
                          <span className="text-slate-600 font-semibold">
                            {(product.price * product.quantity).toLocaleString("fr-FR")} FCFA
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProduct(product.id)}
                              className="p-2 bg-slate-100 hover:bg-green-600 hover:text-white rounded-xl text-slate-600 transition-all"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              disabled={isDeleting}
                              className="p-2 bg-slate-100 hover:bg-red-600 hover:text-white rounded-xl text-slate-600 transition-all disabled:opacity-50"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (

          /* --- MODE GRILLE DE CARTES MARCHAND --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isDeleting = deletingId === product.id;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Produit */}
                    <div className="relative w-full h-44 rounded-2xl bg-slate-100 overflow-hidden mb-3 border border-slate-100">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-slate-300">
                          {product.name.charAt(0)}
                        </div>
                      )}

                      {/* Badge Stock sur Image */}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md ${
                            product.quantity === 0
                              ? "bg-red-600 text-white"
                              : product.quantity < 5
                              ? "bg-amber-500 text-white"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          Stock: {product.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Infos Produit */}
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {product.description || "Aucune description"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Prix</span>
                      <span className="font-black text-slate-900 text-sm">
                        {product.price.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="p-2 bg-slate-100 hover:bg-green-600 hover:text-white rounded-xl text-slate-600 transition-all"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        disabled={isDeleting}
                        className="p-2 bg-slate-100 hover:bg-red-600 hover:text-white rounded-xl text-slate-600 transition-all disabled:opacity-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
