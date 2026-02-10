"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  initialFormData,
  IProductToEdit,
} from "@/app/products/domain/entities/product.entity";
import { CreateProductDto } from "@/app/products/application/dtos/create-product.dto";
import {
  Package,
  Image as ImageIcon,
  DollarSign,
  Hash,
  FileText,
  Tag,
  Upload,
  X,
  Check,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { Category } from "@/app/categories/domain/entities/category.entity";

// ============================================
// INTERFACES
// ============================================

interface ProductFormProps {
  productToEdit?: IProductToEdit;
  onSubmit: (data: CreateProductDto, file?: File | null) => Promise<void>;
  onCancel: () => void;
  availableCategories: Category[];
  onCategoryChange?: (category: Category) => void;
  suggestedName?: string;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function ProductForm({
  productToEdit,
  onSubmit,
  onCancel,
  availableCategories = [],
  onCategoryChange,
  suggestedName,
}: ProductFormProps) {
  // États
  const [formData, setFormData] = useState<CreateProductDto>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isDragOver, setIsDragOver] = useState(false);

  // États pour la navigation dans l'arbre
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedChild, setSelectedChild] = useState<Category | null>(null);

  // États pour tracker les modifications manuelles
  const [hasUserEditedName, setHasUserEditedName] = useState(false);
  const [hasUserEditedDescription, setHasUserEditedDescription] =
    useState(false);

  // Effet pour auto-compléter le nom et la description depuis la catégorie sélectionnée
  useEffect(() => {
    if (selectedChild) {
      // Auto-compléter le nom si l'utilisateur ne l'a pas modifié
      if (!hasUserEditedName) {
        const generatedName = generateProductName(
          selectedParent,
          selectedChild,
        );
        setFormData((prev) => ({ ...prev, name: generatedName }));
      }

      // Auto-compléter la description si l'utilisateur ne l'a pas modifiée
      if (!hasUserEditedDescription && selectedChild.description) {
        setFormData((prev) => ({
          ...prev,
          description: selectedChild.description || "",
        }));
      }
    }
  }, [
    selectedChild,
    selectedParent,
    hasUserEditedName,
    hasUserEditedDescription,
  ]);

  // Effet pour l'autocomplétion externe (si le parent passe un nom suggéré)
  useEffect(() => {
    if (
      suggestedName &&
      !hasUserEditedName &&
      (!formData.name || formData.name === "")
    ) {
      setFormData((prev) => ({ ...prev, name: suggestedName }));
    }
  }, [suggestedName, hasUserEditedName]);

  // Charger les données en mode modification
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        categoryId: productToEdit.categoryId || "",
        price: productToEdit.price || 0,
        quantity: productToEdit.quantity || 0,
        imageUrl: productToEdit.imageUrl || "",
        vendorId: productToEdit.vendorId || "",
      });
      setImagePreview(productToEdit.imageUrl || "");
      setHasUserEditedName(true);
      setHasUserEditedDescription(true);

      // Restaurer la sélection de catégorie
      const category = findCategoryById(
        productToEdit.categoryId,
        availableCategories,
      );
      if (category) {
        const parent = findParentCategory(category.id, availableCategories);
        setSelectedParent(parent);
        setSelectedChild(category);
      }
    }
  }, [productToEdit]);

  // Fonction pour générer un nom de produit basé sur les catégories
  const generateProductName = (
    parent: Category | null,
    child: Category,
  ): string => {
    if (!parent) return child.name;
    return `${child.name} ${parent.name}`;
  };

  // Fonction pour trouver une catégorie par ID
  const findCategoryById = (
    id: string,
    categories: Category[],
  ): Category | null => {
    for (const cat of categories) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategoryById(id, cat.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Fonction pour trouver le parent d'une catégorie
  const findParentCategory = (
    childId: string,
    categories: Category[],
  ): Category | null => {
    for (const cat of categories) {
      if (cat.children?.some((c) => c.id === childId)) {
        return cat;
      }
    }
    return null;
  };

  // Gestion des changements de champs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    // Marquer que l'utilisateur a édité manuellement
    if (name === "name") {
      setHasUserEditedName(true);
    }
    if (name === "description") {
      setHasUserEditedDescription(true);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    setValidationErrors((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  // Réinitialiser le nom pour revoir l'auto-complétion
  const resetNameToAutoComplete = () => {
    if (selectedChild) {
      const generatedName = generateProductName(selectedParent, selectedChild);
      setFormData((prev) => ({ ...prev, name: generatedName }));
      setHasUserEditedName(false);
      toast.success("Nom réinitialisé avec la suggestion", { icon: "✨" });
    }
  };

  // Réinitialiser la description pour revoir l'auto-complétion
  const resetDescriptionToAutoComplete = () => {
    if (selectedChild && selectedChild.description) {
      setFormData((prev) => ({
        ...prev,
        description: selectedChild.description || "",
      }));
      setHasUserEditedDescription(false);
      toast.success("Description réinitialisée avec celle de la catégorie", {
        icon: "✨",
      });
    }
  };

  // Gestion de la sélection de catégorie
  const handleSelectCategory = (cat: Category, isParent: boolean) => {
    if (isParent) {
      // Si on change de parent et qu'une sous-catégorie était déjà sélectionnée
      if (selectedParent?.id !== cat.id) {
        setSelectedParent(cat);
        setSelectedChild(null);
        setFormData((prev) => ({ ...prev, categoryId: "" }));
        setHasUserEditedName(false);
        setHasUserEditedDescription(false);
      } else {
        setSelectedParent(cat);
      }
    } else {
      // Sélection d'une sous-catégorie
      setSelectedChild(cat);
      setFormData((prev) => ({ ...prev, categoryId: cat.id }));

      // Déclencher l'événement de changement de catégorie
      if (onCategoryChange) onCategoryChange(cat);

      // L'auto-complétion se fera via useEffect
    }

    setValidationErrors((prev) => {
      const { categoryId, ...rest } = prev;
      return rest;
    });
  };

  // Gestion de l'image
  const processImageFile = (file: File | null) => {
    setValidationErrors((prev) => {
      const { image, ...rest } = prev;
      return rest;
    });
    if (!file) {
      setImageFile(null);
      return;
    }
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      setValidationErrors((prev) => ({
        ...prev,
        image: "Format non supporté",
      }));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    processImageFile(e.target.files?.[0] || null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) processImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Le nom est obligatoire";
    if (!formData.description.trim())
      errors.description = "La description est obligatoire";
    if (!formData.categoryId)
      errors.categoryId = "Veuillez choisir une catégorie";
    if (formData.price <= 0) errors.price = "Le prix doit être > 0";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const internalHandleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData, imageFile);
    } catch (error) {
      toast.error("Erreur d'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onCancel}
          className="flex items-center text-gray-600 mb-6 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Retour
        </button>

        <form onSubmit={internalHandleSubmit} className="space-y-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* ZONE IMAGE */}
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <ImageIcon className="w-6 h-6 mr-2 text-teal-600" /> Image du
                produit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video md:aspect-square rounded-2xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <Upload className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Aucune image sélectionnée</p>
                    </div>
                  )}
                </div>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors ${isDragOver ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white"}`}
                >
                  <input
                    type="file"
                    id="img-input"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <label
                    htmlFor="img-input"
                    className="cursor-pointer bg-teal-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-teal-700 transition-all"
                  >
                    Choisir une photo
                  </label>
                  <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest">
                    PNG, JPG ou WEBP (Max 2Mo)
                  </p>
                </div>
              </div>
              {validationErrors.image && (
                <p className="mt-2 text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />{" "}
                  {validationErrors.image}
                </p>
              )}
            </div>

            {/* SECTION CATEGORIE (TREE) */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Tag className="w-6 h-6 mr-2 text-teal-600" /> Choisir la
                  catégorie
                </h2>
                {selectedChild && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-teal-50 px-4 py-2 rounded-full">
                    <Check className="w-4 h-4 text-teal-600" />
                    <span className="font-medium">
                      {selectedParent?.name} → {selectedChild.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Niveau 1: Racines */}
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                    1. Catégorie principale
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat, true)}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all border-2 ${selectedParent?.id === cat.id ? "bg-teal-600 border-teal-600 text-white shadow-lg scale-105" : "bg-white border-gray-100 text-gray-600 hover:border-teal-200 hover:shadow-md"}`}
                      >
                        {cat.name}
                        {selectedParent?.id === cat.id && (
                          <ChevronRight className="w-4 h-4 ml-2 inline" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Niveau 2: Enfants */}
                {selectedParent &&
                  selectedParent.children &&
                  selectedParent.children.length > 0 && (
                    <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl animate-in slide-in-from-top-2 duration-300 border border-teal-100">
                      <p className="text-xs font-bold text-teal-700 mb-4 uppercase tracking-wider flex items-center">
                        <ChevronRight className="w-4 h-4 mr-1" />
                        2. Sous-catégorie de {selectedParent.name}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {selectedParent.children.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelectCategory(sub, false)}
                            className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all ${formData.categoryId === sub.id ? "bg-black text-white shadow-xl scale-105" : "bg-white text-gray-700 hover:shadow-md hover:scale-102 border border-gray-100"}`}
                          >
                            {sub.name}
                            {formData.categoryId === sub.id && (
                              <Check className="w-4 h-4 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                {validationErrors.categoryId && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{" "}
                    {validationErrors.categoryId}
                  </p>
                )}
              </div>
            </div>

            {/* INFORMATIONS PRODUIT */}
            <div className="p-8 space-y-6">
              {/* Champ Nom avec option de réinitialisation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Nom de l'article *
                  </label>
                  {hasUserEditedName && selectedChild && (
                    <button
                      type="button"
                      onClick={resetNameToAutoComplete}
                      className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Réinitialiser
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Pagne Bazin Riche"
                    className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all ${validationErrors.name ? "border-red-200 bg-red-50 focus:border-red-500" : "border-gray-100 focus:border-teal-500 text-black shadow-sm hover:border-gray-200"}`}
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-red-500 text-xs font-medium ml-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Prix (FCFA)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  icon={<DollarSign />}
                  error={validationErrors.price}
                  required
                />
                <InputField
                  label="Stock disponible"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  icon={<Hash />}
                  error={validationErrors.quantity}
                  required
                />
              </div>

              {/* Champ Description avec option de réinitialisation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Description détaillée *
                  </label>
                  {hasUserEditedDescription &&
                    selectedChild &&
                    selectedChild.description && (
                      <button
                        type="button"
                        onClick={resetDescriptionToAutoComplete}
                        className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Réinitialiser
                      </button>
                    )}
                </div>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Matière, taille, coloris..."
                  className={`w-full p-4 bg-white border-2 rounded-2xl focus:outline-none transition-all resize-none ${validationErrors.description ? "border-red-200 bg-red-50 focus:border-red-500" : "border-gray-100 focus:border-teal-500 text-black shadow-sm hover:border-gray-200"}`}
                />
                <div className="flex justify-between px-1">
                  {validationErrors.description ? (
                    <p className="text-red-500 text-xs font-medium">
                      {validationErrors.description}
                    </p>
                  ) : (
                    <div />
                  )}
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {formData.description.length} / 500
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 text-gray-500 font-bold hover:text-black transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px] transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="mr-2 w-5 h-5" />
                  {productToEdit ? "Mettre à jour" : "Mettre en vente"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// COMPOSANTS RÉUTILISABLES
// ============================================

const InputField: React.FC<any> = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  icon,
  required,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700 ml-1">
      {label} {required && "*"}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all ${error ? "border-red-200 bg-red-50 focus:border-red-500" : "border-gray-100 focus:border-teal-500 text-black shadow-sm hover:border-gray-200"}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs font-medium ml-1">{error}</p>}
  </div>
);
