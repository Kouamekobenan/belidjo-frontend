"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
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
  Upload,
  X,
  Check,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Eye,
  ShoppingBag,
  Tag,
  Store,
} from "lucide-react";
import toast from "react-hot-toast";
import { Category } from "@/app/categories/domain/entities/category.entity";

interface ProductFormProps {
  productToEdit?: IProductToEdit;
  onSubmit: (data: CreateProductDto, file?: File | null) => Promise<void>;
  onCancel: () => void;
  availableCategories: Category[];
  onCategoryChange?: (category: Category) => void;
  suggestedName?: string;
}

export default function ProductForm({
  productToEdit,
  onSubmit,
  onCancel,
  availableCategories = [],
  onCategoryChange,
  suggestedName,
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductDto>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);

  // Arbre de catégories (Parent / Enfant)
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedChild, setSelectedChild] = useState<Category | null>(null);

  const [hasUserEditedName, setHasUserEditedName] = useState(false);
  const [hasUserEditedDescription, setHasUserEditedDescription] = useState(false);

  // Mode Édition ou Création
  const isEditMode = !!productToEdit;

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

      const category = findCategoryById(productToEdit.categoryId, availableCategories);
      if (category) {
        const parent = findParentCategory(category.id, availableCategories);
        setSelectedParent(parent);
        setSelectedChild(category);
      }
    }
  }, [productToEdit]);

  // Saisie suggérée externe
  useEffect(() => {
    if (suggestedName && !hasUserEditedName && (!formData.name || formData.name === "")) {
      setFormData((prev) => ({ ...prev, name: suggestedName }));
    }
  }, [suggestedName, hasUserEditedName]);

  // Recherche de catégorie dans l'arbre
  const findCategoryById = (id: string, list: Category[]): Category | null => {
    for (const cat of list) {
      if (cat.id === id) return cat;
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(id, cat.children);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentCategory = (childId: string, list: Category[]): Category | null => {
    for (const cat of list) {
      if (cat.children && cat.children.some((c) => c.id === childId)) {
        return cat;
      }
      if (cat.children && cat.children.length > 0) {
        const found = findParentCategory(childId, cat.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Auto-génération de nom basé sur les catégories
  const generateProductName = (parent: Category | null, child: Category): string => {
    if (!parent) return child.name;
    return `${child.name} - ${parent.name}`;
  };

  // Sélection d'une catégorie parente
  const handleParentSelect = (parent: Category) => {
    setSelectedParent(parent);
    setSelectedChild(null);
    setFormData((prev) => ({ ...prev, categoryId: "" }));
  };

  // Sélection d'une sous-catégorie
  const handleChildSelect = (child: Category) => {
    setSelectedChild(child);
    setFormData((prev) => ({ ...prev, categoryId: child.id }));

    if (onCategoryChange) {
      onCategoryChange(child);
    }

    if (!hasUserEditedName) {
      const generatedName = generateProductName(selectedParent, child);
      setFormData((prev) => ({ ...prev, name: generatedName }));
    }

    if (!hasUserEditedDescription && child.description) {
      setFormData((prev) => ({ ...prev, description: child.description || "" }));
    }
  };

  // Changements de champs texte/nombre
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "name") setHasUserEditedName(true);
    if (name === "description") setHasUserEditedDescription(true);

    let parsedValue: any = value;
    if (name === "price" || name === "quantity") {
      parsedValue = value === "" ? 0 : Math.max(0, parseFloat(value) || 0);
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Gestion de l'image
  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Le nom du produit est obligatoire.";
    if (!formData.categoryId) errors.categoryId = "Veuillez sélectionner une sous-catégorie.";
    if (formData.price <= 0) errors.price = "Le prix doit être supérieur à 0 FCFA.";
    if (formData.quantity < 0) errors.quantity = "La quantité ne peut pas être négative.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, imageFile);
    } catch (err) {
      console.error("Erreur de soumission:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/60 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header du formulaire */}
        <div className="flex items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              type="button"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEditMode ? "Modifier le Produit" : "Ajouter un Nouveau Produit"}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isEditMode
                  ? "Mettez à jour les caractéristiques de l'article"
                  : "Remplissez les détails pour le publier sur NoBoutik"}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <Sparkles className="w-3.5 h-3.5" />
            {isEditMode ? "Mode Édition" : "Mode Création"}
          </span>
        </div>

        {/* Grille principale Formulaire + Aperçu Storefront */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Formulaire (Col span 8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. INFORMATIONS GÉNÉRALES */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Informations Générales</h3>
              </div>

              {/* Nom du produit */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Nom du produit <span className="text-red-500">*</span>
                  </label>
                  {selectedChild && !hasUserEditedName && (
                    <button
                      type="button"
                      onClick={() => setHasUserEditedName(true)}
                      className="text-[11px] font-bold text-green-600 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Nom auto-généré
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Sac en cuir artisanal Bondoukou"
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    validationErrors.name ? "border-red-500" : "border-slate-200"
                  } rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all`}
                />
                {validationErrors.name && (
                  <p className="text-xs text-red-500 font-semibold">{validationErrors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Description & Caractéristiques
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.description?.length || 0}/500 car.
                  </span>
                </div>
                <textarea
                  name="description"
                  rows={4}
                  maxLength={500}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez les atouts, la matière et les détails du produit..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* 2. CATÉGORIE ET CLASSIFICATION */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Catégorie du Produit</h3>
              </div>

              {/* Étape 1 : Sélection Catégorie Parente */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  1. Choisissez une Catégorie Principale <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((cat) => {
                    const isSelected = selectedParent?.id === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleParentSelect(cat)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-green-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Étape 2 : Sélection Sous-catégorie */}
              {selectedParent && selectedParent.children && selectedParent.children.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100 animate-in fade-in">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    2. Choisissez une Sous-catégorie <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedParent.children.map((child) => {
                      const isSelected = selectedChild?.id === child.id;
                      return (
                        <button
                          type="button"
                          key={child.id}
                          onClick={() => handleChildSelect(child)}
                          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                            isSelected
                              ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                              : "bg-green-50 text-green-800 border border-green-200 hover:bg-green-100"
                          }`}
                        >
                          <span>{child.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {validationErrors.categoryId && (
                <p className="text-xs text-red-500 font-semibold">{validationErrors.categoryId}</p>
              )}
            </div>

            {/* 3. PRIX ET GESTION DU STOCK */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Prix & Stock</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Prix en FCFA */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Prix de vente (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      min="0"
                      value={formData.price || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      className={`w-full pl-4 pr-16 py-3 bg-slate-50 border ${
                        validationErrors.price ? "border-red-500" : "border-slate-200"
                      } rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-600">
                      FCFA
                    </span>
                  </div>
                  {validationErrors.price && (
                    <p className="text-xs text-red-500 font-semibold">{validationErrors.price}</p>
                  )}
                </div>

                {/* Quantité en Stock */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Quantité en Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="1"
                    className={`w-full px-4 py-3 bg-slate-50 border ${
                      validationErrors.quantity ? "border-red-500" : "border-slate-200"
                    } rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all`}
                  />
                  {validationErrors.quantity && (
                    <p className="text-xs text-red-500 font-semibold">{validationErrors.quantity}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. PHOTO DU PRODUIT */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Photo du Produit</h3>
              </div>

              {imagePreview ? (
                <div className="relative w-full h-64 rounded-3xl overflow-hidden border border-slate-200 group">
                  <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-transform transform group-hover:scale-110"
                    title="Supprimer la photo"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
                    isDragOver ? "border-green-600 bg-green-50/50" : "border-slate-200 hover:border-slate-400 bg-slate-50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label htmlFor="product-image-upload" className="cursor-pointer space-y-3 block">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mx-auto text-green-600">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Glissez-déposez une image ou <span className="text-green-600 underline">parcourez</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Formats acceptés : JPG, PNG, WEBP (Max 2 Mo)</p>
                    </div>
                  </label>
                </div>
              )}

              {/* Option IA : Suppression de l'arrière-plan */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-all">
                  <input
                    type="checkbox"
                    checked={!!formData.removeBg}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, removeBg: e.target.checked }))
                    }
                    className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 accent-emerald-600"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Supprimer automatiquement l'arrière-plan par IA
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Nettoie l'image du produit pour la rendre transparente et ultra-professionnelle sans altérer sa qualité.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Boutons de soumission */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl text-xs shadow-lg shadow-green-600/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEditMode ? "Enregistrer les modifications" : "Publier le produit"}</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Aperçu en direct sur la boutique NoBoutik (Col span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Eye className="w-4 h-4 text-green-600" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Aperçu Fiche Client</h3>
              </div>

              {/* Carte Produit Virtuelle */}
              <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200 space-y-3">
                <div className="relative w-full h-48 rounded-2xl bg-slate-200 overflow-hidden">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-10 h-10 mb-1" />
                      <span className="text-[10px] font-bold">Photo du produit</span>
                    </div>
                  )}

                  <span className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-full shadow-md">
                    {formData.quantity > 0 ? `Stock: ${formData.quantity}` : "Épuisé"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block">
                    {selectedChild?.name || "Catégorie"}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2">
                    {formData.name || "Nom du produit"}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {formData.description || "Description de l'article..."}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-black text-slate-900 text-base">
                    {formData.price > 0 ? `${formData.price.toLocaleString("fr-FR")} FCFA` : "Prix FCFA"}
                  </span>

                  <button type="button" disabled className="px-3 py-1.5 bg-green-600 text-white rounded-xl text-[10px] font-bold opacity-80">
                    Acheter
                  </button>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-2xl border border-green-100 text-[11px] text-green-800 font-medium">
                💡 Cet aperçu montre exactement comment votre produit sera affiché auprès des clients sur NoBoutik.
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
