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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));

    // setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
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
    }
  };

  // Traiter le fichier image
  const processImageFile = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (!productToEdit) {
      setImagePreview("");
    }
  };

  // Supprimer l'image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(productToEdit?.imageUrl || "");
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Le nom est obligatoire";
    } else if (formData.name.length > 100) {
      errors.name = "Le nom ne doit pas dépasser 100 caractères";
    }

    if (!formData.description.trim()) {
      errors.description = "La description est obligatoire";
    } else if (formData.description.length > 500) {
      errors.description = "La description ne doit pas dépasser 500 caractères";
    }

    if (!formData.categoryId) {
      errors.categoryId = "La catégorie est obligatoire";
    }

    if (formData.price <= 0) {
      errors.price = "Le prix doit être supérieur à 0";
    }

    if (formData.quantity < 0) {
      errors.quantity = "La quantité ne peut pas être négative";
    }

    if (!productToEdit && !imagePreview && !imageFile) {
      errors.image = "L'image du produit est obligatoire";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, imageFile);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert(
        `Échec de l'opération : ${
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue"
        }`
      );
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
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                    isDragOver
                      ? "border-green-500 bg-blue-50"
                      : "border-gray-300 bg-white hover:border-green-400"
                  }`}
                >
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Upload className="w-8 h-8 text-green-600" />
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
                      PNG, JPG, GIF jusqu'à 10MB
                    </p>
                  </div>
                </div>
              </div>

              {validationErrors.image && (
                <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{validationErrors.image}</p>
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
        } pr-4 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      />
    </div>
    {error && (
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p className="text-sm">{error}</p>
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
      className={`w-full px-4 py-3 border text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
        error
          ? "border-red-500 bg-red-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    />
    <div className="flex justify-between items-center">
      {error ? (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <div></div>
      )}
      <span className="text-xs text-gray-500">
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
        } pr-10 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400"
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
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    )}
  </div>
);
