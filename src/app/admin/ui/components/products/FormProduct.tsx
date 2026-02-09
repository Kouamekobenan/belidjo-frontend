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
} from "lucide-react";
import toast from "react-hot-toast";
import { Category } from "@/app/categories/domain/entities/category.entity";

// ============================================
// INTERFACES (Mises à jour pour le Tree)
// ============================================


interface ProductFormProps {
  productToEdit?: IProductToEdit;
  onSubmit: (data: CreateProductDto, file?: File | null) => Promise<void>;
  onCancel: () => void;
  availableCategories: Category[]; // Modifié pour accepter l'arbre
  onCategoryChange?: (category: Category) => void; // Pour l'autocomplétion
  suggestedName?: string; // Nom suggéré par le parent
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
  const [selectedParent, setSelectedParent] = useState<Category | null>(
    null,
  );

  // Effet pour l'autocomplétion : Injecte le nom suggéré si le nom est vide
  useEffect(() => {
    if (suggestedName && (!formData.name || formData.name === "")) {
      setFormData((prev) => ({ ...prev, name: suggestedName }));
    }
  }, [suggestedName]);

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
    }
  }, [productToEdit]);

  // Gestion des changements de champs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    setValidationErrors((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  // Gestion de la sélection de catégorie (Tree)
  const handleSelectCategory = (cat: Category, isParent: boolean) => {
    if (isParent) {
      setSelectedParent(cat);
      // On réinitialise l'ID produit si on change de parent
      setFormData((prev) => ({ ...prev, categoryId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, categoryId: cat.id }));
      // On déclenche l'autocomplétion vers le parent
      if (onCategoryChange) onCategoryChange(cat);
    }

    setValidationErrors((prev) => {
      const { categoryId, ...rest } = prev;
      return rest;
    });
  };

  // ... (Garder tes fonctions processImageFile, handleFileChange, handleDrop, removeImage identiques)
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
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
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
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Tag className="w-6 h-6 mr-2 text-teal-600" /> Choisir la
                catégorie
              </h2>

              <div className="space-y-6">
                {/* Niveau 1: Racines */}
                <div className="flex flex-wrap gap-3">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat, true)}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all border-2 ${selectedParent?.id === cat.id ? "bg-teal-600 border-teal-600 text-white shadow-lg" : "bg-white border-gray-100 text-gray-600 hover:border-teal-200"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Niveau 2: Enfants */}
                {selectedParent &&
                  selectedParent.children &&
                  selectedParent.children.length > 0 && (
                    <div className="p-6 bg-teal-50/50 rounded-3xl animate-in slide-in-from-top-2 duration-300">
                      <p className="text-xs font-bold text-teal-700 mb-4 uppercase tracking-wider">
                        Sous-catégories de {selectedParent.name}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {selectedParent.children.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelectCategory(sub, false)}
                            className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all ${formData.categoryId === sub.id ? "bg-black text-white shadow-xl scale-105" : "bg-white text-gray-700 hover:shadow-md"}`}
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
              <InputField
                label="Nom de l'article"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Pagne Bazin Riche"
                error={validationErrors.name}
                icon={<Package />}
                required
              />

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

              <TextAreaField
                label="Description détaillée"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Matière, taille, coloris..."
                error={validationErrors.description}
                required
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 text-gray-500 font-bold hover:text-black"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Check className="mr-2" />
              )}
              {productToEdit ? "Mettre à jour" : "Mettre en vente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// COMPOSANTS RÉUTILISABLES (Inchangés)
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

const TextAreaField: React.FC<any> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700 ml-1">
      {label} {required && "*"}
    </label>
    <textarea
      name={name}
      rows={4}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-4 bg-white border-2 rounded-2xl focus:outline-none transition-all resize-none ${error ? "border-red-200 bg-red-50 focus:border-red-500" : "border-gray-100 focus:border-teal-500 text-black shadow-sm hover:border-gray-200"}`}
    />
    <div className="flex justify-between px-1">
      {error ? (
        <p className="text-red-500 text-xs font-medium">{error}</p>
      ) : (
        <div />
      )}
      <p className="text-[10px] text-gray-400 font-bold uppercase">
        {value.length} / 500
      </p>
    </div>
  </div>
);
