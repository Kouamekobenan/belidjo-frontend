// /dashboard/vendor/products/create.tsx
"use client";
import { useEffect, useState, useRef, ChangeEvent, useCallback } from "react";
import { CategoryRepository } from "@/app/categories/infrastructure/category-repository.impl";
import { CategoryMapper } from "@/app/categories/domain/mappers/category.mapper";
import { Category } from "@/app/categories/domain/entities/category.entity";
import Image from "next/image";
import { Pencil, Trash2, FolderTree, X, Search, Plus } from "lucide-react";
import { FindAllCategoryUseCase } from "@/app/categories/application/usescases/get-all-usecase";
import toast from "react-hot-toast";
import { DeleteCategoryUseCase } from "@/app/categories/application/usescases/delete-cat.usecase";
import { CreateCategoryUseCase } from "@/app/categories/application/usescases/create-category.usecase";
import { CreateCategoryDto } from "@/app/categories/application/dtos/create-cat.dto";
import { UpdateCategoryUseCase } from "@/app/categories/application/usescases/update-category.usecase";

const CATEGORIES_PER_PAGE = 12;
// État initial du formulaire
const initialFormData: CreateCategoryDto = {
  name: "",
  description: "",
  imageUrl: "",
  vendorId: "",
};

// Props du composant principal
interface VendorCategoriesDashboardProps {
  vendorId: string;
}
const catRepo = new CategoryRepository(new CategoryMapper());
const deleteCategoryUseCase = new DeleteCategoryUseCase(catRepo);
const createCategoryUseCase = new CreateCategoryUseCase(catRepo);
const updateCategoryUseCase = new UpdateCategoryUseCase(catRepo);

export default function VendorCategoriesDashboard({
  vendorId,
}: VendorCategoriesDashboardProps) {
  // États principaux
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour la gestion des images
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string>("");

  // États du modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [formData, setFormData] = useState<CreateCategoryDto>(initialFormData);

  // États pour la suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  // Instances des repositories et use cases
  const catRepo = new CategoryRepository(new CategoryMapper());
  const findAllCategoryUseCase = new FindAllCategoryUseCase(catRepo);

  // Fonction pour charger les catégories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await findAllCategoryUseCase.execute(
        vendorId,
        CATEGORIES_PER_PAGE,
        currentPage
      );
      setCategories(response.data);
      setTotalPages(response.totalPages || 1);
      setTotalCategories(response.total || 0);
    } catch (err: any) {
      setError("Impossible de charger les catégories.");
      toast.error("Erreur lors du chargement des catégories");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, [vendorId, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Gestion de la pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Ouvre le modal de création
  const handleCreateNew = () => {
    setModalMode("create");
    setFormData(initialFormData);
    setImageFile(null);
    setImageUrlPreview("");
    setSelectedCategory(null);
    setShowModal(true);
  };

  // Ouvre le modal d'édition
  const handleEdit = (category: Category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      imageUrl: "",
      vendorId: "",
    });
    setImageFile(null);
    setImageUrlPreview(category.imageUrl || "");
    setShowModal(true);
  };

  // Nettoyage de l'URL de prévisualisation
  const cleanupPreviewUrl = () => {
    if (imageUrlPreview && imageUrlPreview.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrlPreview);
    }
  };

  // Fermeture du modal avec nettoyage
  const handleCloseModal = () => {
    cleanupPreviewUrl();
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Le nom de la catégorie est obligatoire.");
      return;
    }

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
        vendorId: vendorId, // Injecté
      };

      let successMessage = "";

      if (modalMode === "create") {
        // --- MODE CRÉATION ---
        // 1. Appel du Use Case de Création
        await createCategoryUseCase.execute(categoryData, imageFile);
        successMessage = "Catégorie créée avec succès !";
      } else if (modalMode === "edit" && selectedCategory) {
        // --- MODE MODIFICATION ---
        // 1. S'assurer d'avoir l'ID de la catégorie à modifier
        const categoryId = selectedCategory.id;
        // 2. Appel du Use Case de Modification
        // Note: Nous utilisons formData directement pour l'update, en incluant l'ID (selectedCategory.id)
        await updateCategoryUseCase.execute(
          categoryId,
          categoryData, // Passe le DTO avec les nouvelles valeurs
          imageFile
        );
        successMessage = "Catégorie modifiée avec succès !";
      } else {
        // Cas de sécurité (ne devrait pas arriver)
        throw new Error(
          "Mode de soumission ou catégorie sélectionnée invalide."
        );
      }
      toast.success(successMessage);
      handleCloseModal();
      fetchCategories(); // Recharger la liste après succès
    } catch (err: any) {
      toast.error(
        err?.message || "Une erreur est survenue lors de l'opération."
      );
      console.error("Erreur lors de la soumission:", err);
    }
  };
  // Gestion de la suppression
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      // TODO: Implémenter le use case de suppression
      await deleteCategoryUseCase.execute(categoryToDelete.id);
      toast.success("Catégorie supprimée avec succès !");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.message || "Impossible de supprimer la catégorie.");
      console.error("Erreur lors de la suppression:", err);
    }
  };

  // Filtrage des catégories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rendu de l'état de chargement
  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  // Rendu de l'état d'erreur
  if (error && categories.length === 0) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchCategories}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Catalogue des categories
          </h2>
          <p className="text-gray-600 mt-1">
            {totalCategories} catégorie{totalCategories > 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nouvelle catégorie
        </button>
      </div>
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 text-gray-950 border-2 border-gray-300 rounded-xl focus:border-teal-500 transition-all outline-none"
        />
      </div>
      {/* Liste des catégories */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune catégorie trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "Aucune catégorie ne correspond à votre recherche."
              : "Commencez par créer votre première catégorie."}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Créer une catégorie
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Vue Tableau (Large Écran) */}
          <CategoryTable
            categories={filteredCategories}
            handleEdit={handleEdit}
            handleDelete={handleDeleteClick}
            loading={loading}
          />

          {/* Vue Liste (Petit Écran) */}
          <CategoryCardList
            categories={filteredCategories}
            handleEdit={handleEdit}
            handleDelete={handleDeleteClick}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          page === currentPage
                            ? "bg-teal-600 text-white"
                            : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Modal Création/Édition */}
      <CategoryFormModal
        showModal={showModal}
        setShowModal={handleCloseModal}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        imageFile={imageFile}
        setImageFile={setImageFile}
        imageUrlPreview={imageUrlPreview}
        setImageUrlPreview={setImageUrlPreview}
      />

      {/* Modal Confirmation Suppression */}
      {showDeleteModal && categoryToDelete && (
        <DeleteConfirmationModal
          category={categoryToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setCategoryToDelete(null);
          }}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------------
// SOUS-COMPOSANTS
// ----------------------------------------------------------------------------------

// Props communes pour les listes
interface CategoryListProps {
  categories: Category[];
  handleEdit: (category: Category) => void;
  handleDelete: (category: Category) => void;
  loading?: boolean;
}

// Vue Tableau (Desktop)
const CategoryTable: React.FC<CategoryListProps> = ({
  categories,
  handleEdit,
  handleDelete,
  loading,
}) => (
  <div className="hidden lg:block overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
            Image
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nom
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
            Description
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {loading ? (
          <tr>
            <td colSpan={4} className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            </td>
          </tr>
        ) : (
          categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <FolderTree className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                  {cat.name}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate hidden xl:table-cell">
                {cat.description || "Aucune description"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-2 text-teal-600 hover:text-teal-800 rounded-lg hover:bg-teal-50 transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// Vue Liste (Mobile/Tablet)
const CategoryCardList: React.FC<CategoryListProps> = ({
  categories,
  handleEdit,
  handleDelete,
}) => (
  <div className="lg:hidden p-4 space-y-3">
    {categories.map((cat) => (
      <div
        key={cat.id}
        className="bg-white border-2 border-gray-200 hover:border-teal-300 rounded-xl p-4 transition-all duration-200 shadow-sm"
      >
        <div className="flex items-start gap-4">
          {/* Image */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            {cat.imageUrl ? (
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <FolderTree className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate">
              {cat.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {cat.description || "Aucune description"}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(cat)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-medium rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Composant Input File
interface InputFileButtonProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imageUrlPreview: string;
  setImageUrlPreview: (url: string) => void;
  label: string;
}

const InputFileButton: React.FC<InputFileButtonProps> = ({
  imageFile,
  setImageFile,
  imageUrlPreview,
  setImageUrlPreview,
  label,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validation du type de fichier
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image valide.");
        return;
      }

      // Validation de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo.");
        return;
      }

      // Nettoyer l'ancienne URL si c'est un blob
      if (imageUrlPreview.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrlPreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setImageUrlPreview(previewUrl);
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    if (imageUrlPreview.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrlPreview);
    }
    setImageUrlPreview("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 text-teal-700 font-medium rounded-xl hover:bg-teal-100 transition-colors shadow-sm"
        >
          <FolderTree className="w-5 h-5" />
          {imageUrlPreview ? "Changer l'image" : "Choisir une image"}
        </button>
        {imageUrlPreview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 font-medium rounded-xl hover:bg-red-100 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
            Supprimer
          </button>
        )}
      </div>

      {/* Aperçu de l'image */}
      {imageUrlPreview && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-300">
          <Image
            src={imageUrlPreview}
            alt="Aperçu"
            fill
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
};
// Modal Formulaire
interface CategoryFormModalProps {
  showModal: boolean;
  setShowModal: () => void;
  modalMode: "create" | "edit";
  formData: CreateCategoryDto;
  setFormData: React.Dispatch<React.SetStateAction<CreateCategoryDto>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageUrlPreview: string;
  setImageUrlPreview: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  showModal,
  setShowModal,
  modalMode,
  formData,
  setFormData,
  handleSubmit,
  imageFile,
  setImageFile,
  imageUrlPreview,
  setImageUrlPreview,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h3 className="text-2xl font-bold text-gray-900">
            {modalMode === "create"
              ? "Nouvelle catégorie"
              : "Modifier la catégorie"}
          </h3>
          <button
            type="button"
            onClick={setShowModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de la catégorie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 text-gray-900 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
              placeholder="Ex: Électronique"
              maxLength={100}
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none resize-none"
              placeholder="Décrivez cette catégorie..."
              maxLength={500}
            />
          </div>

          {/* Upload d'image */}
          <InputFileButton
            label="Image de la catégorie"
            imageFile={imageFile}
            setImageFile={setImageFile}
            imageUrlPreview={imageUrlPreview}
            setImageUrlPreview={setImageUrlPreview}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={setShowModal}
              className="flex-1 px-6 py-3 border-2  border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {modalMode === "create" ? "Créer la catégorie" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de confirmation de suppression
interface DeleteConfirmationModalProps {
  category: Category;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  category,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-red-100 rounded-full">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Confirmer la suppression
        </h3>
      </div>
      <p className="text-gray-600 mb-6">
        Êtes-vous sûr de vouloir supprimer la catégorie{" "}
        <span className="font-semibold">"{category.name}"</span> ? Cette action
        est irréversible.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
);
