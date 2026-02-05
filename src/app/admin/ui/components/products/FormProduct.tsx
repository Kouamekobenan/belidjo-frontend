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
} from "lucide-react";
import toast from "react-hot-toast";

// ============================================
// INTERFACES
// ============================================

interface ProductFormProps {
  productToEdit?: IProductToEdit;
  onSubmit: (data: CreateProductDto, file?: File | null) => Promise<void>;
  onCancel: () => void;
  availableCategories: { id: string; name: string }[];
}

interface FieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  min?: number;
  step?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function ProductForm({
  productToEdit,
  onSubmit,
  onCancel,
  availableCategories = [],
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
    } else {
      setFormData(initialFormData);
      setImagePreview("");
    }
    setValidationErrors({});
  }, [productToEdit]);

  // Gestion des changements de champs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));

    // Supprimer l'erreur du champ modifié
    setValidationErrors((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  // Gestion du fichier image
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    processImageFile(file);
  };

  // Gestion du drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImageFile(file);
    } else if (file) {
      setValidationErrors((prev) => ({
        ...prev,
        image: "Le fichier déposé n'est pas une image valide",
      }));
    }
  };

  // Traiter le fichier image avec validation détaillée
  const processImageFile = (file: File | null) => {
    // Réinitialiser les erreurs d'image
    setValidationErrors((prev) => {
      const { image, ...rest } = prev;
      return rest;
    });

    if (!file) {
      setImageFile(null);
      if (!productToEdit) {
        setImagePreview("");
      }
      return;
    }

    // Validation du type de fichier
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      setValidationErrors((prev) => ({
        ...prev,
        image: `Format de fichier non supporté (${file.type}). Formats acceptés: JPG, PNG, GIF, WEBP`,
      }));
      return;
    }

    // Validation de la taille (10MB maximum)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MiB (environ 2.1 MB)
    if (file.size > maxSizeInBytes) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setValidationErrors((prev) => ({
        ...prev,
        image: `L'image est trop volumineuse (${fileSizeInMB} MiB). Taille maximale autorisée: 2 MiB`,
      }));
      return;
    }

    // Si tout est valide, traiter l'image
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setValidationErrors((prev) => ({
        ...prev,
        image:
          "Erreur lors de la lecture du fichier. Veuillez réessayer avec une autre image.",
      }));
    };
    reader.readAsDataURL(file);
  };

  // Supprimer l'image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(productToEdit?.imageUrl || "");
    // Supprimer l'erreur d'image s'il y en avait une
    setValidationErrors((prev) => {
      const { image, ...rest } = prev;
      return rest;
    });
  };

  // Validation du formulaire avec messages détaillés
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validation du nom
    if (!formData.name.trim()) {
      errors.name = "Le nom du produit est obligatoire";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Le nom doit contenir au moins 2 caractères";
    } else if (formData.name.length > 100) {
      errors.name = `Le nom est trop long (${formData.name.length}/100 caractères)`;
    }

    // Validation de la description
    if (!formData.description.trim()) {
      errors.description = "La description du produit est obligatoire";
    } else if (formData.description.trim().length < 2) {
      errors.description =
        "La description doit contenir au moins 2 caractères";
    } else if (formData.description.length > 500) {
      errors.description = `La description est trop longue (${formData.description.length}/500 caractères)`;
    }

    // Validation de la catégorie
    if (!formData.categoryId) {
      errors.categoryId = "Veuillez sélectionner une catégorie pour ce produit";
    }

    // Validation du prix
    if (formData.price <= 0) {
      errors.price = "Le prix doit être supérieur à 0 FCFA";
    } else if (formData.price > 10000000) {
      errors.price = "Le prix semble anormalement élevé. Veuillez vérifier.";
    }

    // Validation de la quantité
    if (formData.quantity < 0) {
      errors.quantity = "La quantité ne peut pas être négative";
    } else if (formData.quantity > 1000000) {
      errors.quantity =
        "La quantité semble anormalement élevée. Veuillez vérifier.";
    }

    // Validation de l'image (uniquement pour les nouveaux produits)
    if (!productToEdit && !imagePreview && !imageFile) {
      errors.image =
        "L'image du produit est obligatoire pour créer un nouveau produit";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire avec gestion d'erreurs améliorée
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll vers la première erreur
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstErrorElement = document.getElementById(firstErrorKey);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, imageFile);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);

      // Message d'erreur détaillé selon le type d'erreur
      let errorMessage = "Une erreur est survenue lors de l'enregistrement";

      if (error instanceof Error) {
        // Détecter les types d'erreurs courants
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Erreur de connexion. Vérifiez votre connexion Internet et réessayez.";
        } else if (
          error.message.includes("401") ||
          error.message.includes("unauthorized")
        ) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
        } else if (
          error.message.includes("403") ||
          error.message.includes("forbidden")
        ) {
          errorMessage =
            "Vous n'avez pas l'autorisation d'effectuer cette action.";
        } else if (error.message.includes("404")) {
          errorMessage =
            "Ressource introuvable. Le produit a peut-être été supprimé.";
        } else if (
          error.message.includes("413") ||
          error.message.includes("too large")
        ) {
          errorMessage =
            "L'image est trop volumineuse pour être téléchargée. Essayez avec une image plus petite.";
        } else if (error.message.includes("500")) {
          errorMessage =
            "Erreur serveur. Veuillez réessayer dans quelques instants.";
        } else {
          errorMessage = `Erreur: ${error.message}`;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Détermination du mode
  const isEditMode = !!productToEdit;
  const title = isEditMode ? "Modifier le produit" : "Nouveau produit";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header avec retour */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onCancel}
            className="group inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Retour à la liste</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode
                  ? "Modifiez les informations de votre produit"
                  : "Ajoutez un nouveau produit à votre catalogue"}
              </p>
            </div>
          </div>
        </div>
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card principale */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Section Image */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 sm:px-8 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <ImageIcon className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Image du produit
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Aperçu de l'image */}
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-300 shadow-inner">
                    {imagePreview ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-16 h-16 mb-2" />
                        <p className="text-sm">Aucune image</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Zone de téléversement */}
                <div
                  id="image"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                    isDragOver
                      ? "border-green-500 bg-blue-50"
                      : validationErrors.image
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white hover:border-green-400"
                  }`}
                >
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div
                        className={`p-4 rounded-full ${validationErrors.image ? "bg-red-100" : "bg-blue-100"}`}
                      >
                        <Upload
                          className={`w-8 h-8 ${validationErrors.image ? "text-red-600" : "text-green-600"}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-green-600 font-semibold hover:text-green-700">
                          Choisir un fichier
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          ou glisser-déposer
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WEBP jusqu'à 2MiB MB
                    </p>
                  </div>
                </div>
              </div>

              {validationErrors.image && (
                <div className="mt-4 flex items-start space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    {validationErrors.image}
                  </p>
                </div>
              )}
            </div>

            {/* Section Informations générales */}
            <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Informations générales
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Nom du produit"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Coca-Cola 1L"
                  error={validationErrors.name}
                  icon={<Package className="w-5 h-5" />}
                  required
                />

                <SelectField
                  label="Catégorie"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  options={availableCategories}
                  error={validationErrors.categoryId}
                  icon={<Tag className="w-5 h-5" />}
                  required
                />
              </div>

              <div className="mt-6">
                <TextAreaField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre produit en détail..."
                  error={validationErrors.description}
                  required
                />
              </div>
            </div>

            {/* Section Prix et Stock */}
            <div className="px-6 sm:px-8 py-6">
              <div className="flex items-center space-x-3 mb-6">
                <DollarSign className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Prix et stock
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Prix unitaire (FCFA)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 1000"
                  min={0}
                  step="0.01"
                  error={validationErrors.price}
                  icon={<DollarSign className="w-5 h-5" />}
                  required
                />

                <InputField
                  label="Quantité en stock"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Ex: 50"
                  min={0}
                  error={validationErrors.quantity}
                  icon={<Hash className="w-5 h-5" />}
                  required
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full cursor-pointer sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <span className="relative flex items-center justify-center space-x-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>
                      {isEditMode ? "Enregistrer" : "Créer le produit"}
                    </span>
                  </>
                )}
              </span>
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

const InputField: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  min,
  step,
  icon,
  required,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className={`w-full ${
          icon ? "pl-11" : "pl-4"
        } pr-4 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-500 bg-red-50 focus:ring-red-500"
            : "border-gray-300 bg-white hover:border-gray-400 focus:ring-blue-500 focus:border-transparent"
        }`}
      />
    </div>
    {error && (
      <div className="flex items-start space-x-2 text-red-600">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    )}
  </div>
);

const TextAreaField: React.FC<Omit<FieldProps, "type" | "min" | "step">> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      id={name}
      rows={4}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border text-black rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
        error
          ? "border-red-500 bg-red-50 focus:ring-red-500"
          : "border-gray-300 bg-white hover:border-gray-400 focus:ring-blue-500 focus:border-transparent"
      }`}
    />
    <div className="flex justify-between items-start">
      {error ? (
        <div className="flex items-start space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div></div>
      )}
      <span
        className={`text-xs ${value.toString().length > 500 ? "text-red-500 font-semibold" : "text-gray-500"}`}
      >
        {value.toString().length}/500 caractères
      </span>
    </div>
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string; name: string }[];
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  icon,
  required,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`w-full ${
          icon ? "pl-11" : "pl-4"
        } pr-10 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 transition-all appearance-none ${
          error
            ? "border-red-500 bg-red-50 focus:ring-red-500"
            : "border-gray-300 bg-white hover:border-gray-400 focus:ring-blue-500 focus:border-transparent"
        }`}
      >
        <option value="" disabled>
          Sélectionnez une catégorie...
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    {error && (
      <div className="flex items-start space-x-2 text-red-600">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    )}
  </div>
);
