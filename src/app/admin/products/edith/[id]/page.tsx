"use client";
import ProductForm from "@/app/admin/ui/components/products/FormProduct";
import { CreateProductDto } from "@/app/products/application/dtos/create-product.dto";
import {
  IProductToEdit,
  Product,
} from "@/app/products/domain/entities/product.entity";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";
import { UpdateProductUseCase } from "@/app/products/application/usecases/update-product.usecase";
import { api } from "@/app/lib/api";
import { Category } from "@/app/categories/domain/entities/category.entity";
import { CategoryRepository } from "@/app/categories/infrastructure/category-repository.impl";
import { CategoryMapper } from "@/app/categories/domain/mappers/category.mapper";
import { FindAllCategoryUseCase } from "@/app/categories/application/usescases/get-all-usecase";
import toast from "react-hot-toast";
import { Loader2, AlertCircle } from "lucide-react";

const repo = new ProductRepository(new ProductMapper());
const updateProductUseCase = new UpdateProductUseCase(repo);
const catRepo = new CategoryRepository(new CategoryMapper());
const findAllCategoryUseCase = new FindAllCategoryUseCase(catRepo);
const CATEGORIES_PER_PAGE = 100;

export default function EditProductPage() {
  const param = useParams();
  const { id } = param;
  const router = useRouter();

  const [productData, setProductData] = useState<IProductToEdit | undefined>(
    undefined
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération du produit
  const fetchProductById = async (id: string): Promise<IProductToEdit> => {
    try {
      const response = await api.get(`/products/product/${id}`);
      const productData = response.data.data;
      setProduct(productData);
      return productData;
    } catch (err) {
      throw new Error("Impossible de charger le produit");
    }
  };

  // Récupération des catégories
  const fetchCategories = async (vendorId: string) => {
    try {
      const response = await findAllCategoryUseCase.execute(
        vendorId,
        CATEGORIES_PER_PAGE,
        1
      );

      let categoriesData: Category[] = [];
      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      }

      setCategories(categoriesData);
    } catch (err) {
      console.error("Erreur lors de la récupération des catégories:", err);
      toast.error("Impossible de charger les catégories");
    }
  };

  // Chargement initial du produit
  useEffect(() => {
    if (!id || typeof id !== "string") {
      setError("ID du produit invalide");
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProductData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Chargement des catégories quand vendorId est disponible
  useEffect(() => {
    if (product?.vendorId) {
      fetchCategories(product.vendorId);
    }
  }, [product?.vendorId]);

  // Soumission du formulaire
  const handleSubmit = async (data: CreateProductDto, file?: File | null) => {
    if (typeof id !== "string") {
      toast.error("ID du produit invalide");
      return;
    }

    try {
      await updateProductUseCase.execute(id, data, file);
      toast.success("Produit modifié avec succès !");
      router.back();
    } catch (err) {
      toast.error("Erreur lors de la modification du produit");
      throw err;
    }
  };

  // États de chargement et d'erreur avec design amélioré
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Chargement du produit
            </h2>
            <p className="text-sm text-gray-500 mt-1">Veuillez patienter...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error || !productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Produit introuvable
            </h2>
            <p className="text-gray-600 mt-2">
              {error || "Le produit demandé n'existe pas ou a été supprimé."}
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/products")}
            className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Formulaire avec carte */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <ProductForm
            productToEdit={productData}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            availableCategories={categories}
          />
        </div>
      </div>
    </div>
  );
}
