"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  ImagePlus,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileImage,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FlashStoryRepository } from "@/app/flash-story/infrastructure/api/flash-story.api";
import { CreateFlashStoryUseCase } from "@/app/flash-story/application/usecases/create-flash-story.usecase";
import { FlashStoryEntity } from "@/app/flash-story/domain/entities/flash-story.entity";

const repo = new FlashStoryRepository();
const createFlashStory = new CreateFlashStoryUseCase(repo);

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImagePreview {
  file: File;
  preview: string;
  caption: string;
}

interface FlashStoryCreateFormProps {
  vendorId: string;
  onCreated: (story: FlashStoryEntity) => void;
}

export default function FlashStoryCreateForm({
  vendorId,
  onCreated,
}: FlashStoryCreateFormProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Format "${file.type}" non supporté. Utilisez JPG, PNG ou WEBP.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return `Image trop volumineuse (${sizeMb} Mo). Maximum 5 Mo.`;
    }
    return null;
  };

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newImages: ImagePreview[] = [];
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        if (images.length + newImages.length >= MAX_IMAGES) {
          toast.error(`Maximum ${MAX_IMAGES} images autorisées.`);
          break;
        }

        const error = validateFile(file);
        if (error) {
          toast.error(error);
          continue;
        }

        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          caption: "",
        });
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
      }
    },
    [images.length],
  );

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateCaption = (index: number, caption: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img)),
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      toast.error("Ajoutez au moins 1 image pour créer votre Flash Story.");
      return;
    }

    setIsSubmitting(true);
    try {
      const files = images.map((img) => img.file);
      const captions = images.map((img) => img.caption).filter(Boolean);

      const story = await createFlashStory.execute(
        vendorId,
        files,
        title || undefined,
        captions.length > 0 ? captions : undefined,
      );

      toast.success("Flash Story publiée avec succès ! ⚡");

      // Cleanup previews
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setTitle("");

      onCreated(story);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Erreur lors de la publication.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Titre optionnel */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Titre de votre Story (optionnel)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Nos nouveautés du jour 🔥"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
          maxLength={100}
        />
      </div>

      {/* Zone de Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-green-500 bg-green-50/80 scale-[1.02]"
            : images.length > 0
              ? "border-slate-200 bg-slate-50/50 hover:border-green-400 hover:bg-green-50/30"
              : "border-slate-300 bg-slate-50 hover:border-green-400 hover:bg-green-50/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="hidden"
        />

        {images.length === 0 ? (
          /* Zone vide — Message d'invite */
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                isDragging
                  ? "bg-green-500 text-white scale-110"
                  : "bg-gradient-to-br from-green-100 to-green-200 text-green-600"
              }`}
            >
              {isDragging ? (
                <Upload className="w-7 h-7 animate-bounce" />
              ) : (
                <ImagePlus className="w-7 h-7" />
              )}
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">
              {isDragging
                ? "Déposez vos images ici..."
                : "Glissez-déposez vos images ici"}
            </p>
            <p className="text-xs text-slate-400">
              ou cliquez pour parcourir • JPG, PNG, WEBP • Max 5 Mo par image
            </p>
            <div className="flex items-center gap-2 mt-3">
              {[...Array(MAX_IMAGES)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-slate-200"
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {MAX_IMAGES} images maximum
            </p>
          </div>
        ) : (
          /* Previews des images */
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Badge numéro */}
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">
                      {index + 1}
                    </div>

                    {/* Bouton supprimer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Taille du fichier */}
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
                        <FileImage className="w-3 h-3" />
                        {(img.file.size / (1024 * 1024)).toFixed(1)} Mo
                      </span>
                    </div>
                  </div>

                  {/* Caption input */}
                  <div className="p-2">
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      placeholder="Légende (optionnel)"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-green-500/30"
                      maxLength={120}
                    />
                  </div>
                </div>
              ))}

              {/* Slot pour ajouter plus d'images */}
              {images.length < MAX_IMAGES && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="flex flex-col items-center justify-center aspect-[4/5] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer"
                >
                  <ImagePlus className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-400">
                    Ajouter
                  </span>
                  <span className="text-[10px] text-slate-300">
                    {images.length}/{MAX_IMAGES}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Indicateur d'expiration */}
      {images.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-amber-700 font-medium">
            Votre Flash Story expirera automatiquement après{" "}
            <strong>24 heures</strong>. Vous ne pouvez publier qu'une seule
            story à la fois.
          </span>
        </div>
      )}

      {/* Bouton de publication */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || images.length === 0}
        className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg ${
          isSubmitting || images.length === 0
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0"
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Publication en cours...</span>
          </>
        ) : images.length === 0 ? (
          <>
            <Upload className="w-4 h-4" />
            <span>Ajoutez des images pour publier</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>
              Publier ma Flash Story ({images.length} image
              {images.length > 1 ? "s" : ""})
            </span>
          </>
        )}
      </button>
    </div>
  );
}
