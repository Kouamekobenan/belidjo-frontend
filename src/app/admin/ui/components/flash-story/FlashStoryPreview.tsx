"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Trash2,
  ExternalLink,
  Zap,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
import Image from "next/image";
import { FlashStoryEntity } from "@/app/flash-story/domain/entities/flash-story.entity";
import { FlashStoryRepository } from "@/app/flash-story/infrastructure/api/flash-story.api";
import { DeleteFlashStoryUseCase } from "@/app/flash-story/application/usecases/delete-flash-story.usecase";
import toast from "react-hot-toast";

const repo = new FlashStoryRepository();
const deleteFlashStory = new DeleteFlashStoryUseCase(repo);

interface FlashStoryPreviewProps {
  story: FlashStoryEntity;
  onDeleted: () => void;
}

function useCountdown(expiresAt: string) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, percent: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const expires = new Date(expiresAt).getTime();
      const created = expires - 24 * 60 * 60 * 1000; // 24h avant expiration
      const totalDuration = expires - created;
      const remaining = Math.max(0, expires - now);
      const percent = Math.max(0, Math.min(100, (remaining / totalDuration) * 100));

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, percent });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}

export default function FlashStoryPreview({
  story,
  onDeleted,
}: FlashStoryPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { hours, minutes, seconds, percent } = useCountdown(story.expiresAt);

  const sortedItems = [...story.items].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sortedItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sortedItems.length) % sortedItems.length,
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFlashStory.execute(story.id);
      toast.success("Flash Story supprimée avec succès.");
      onDeleted();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erreur lors de la suppression.",
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isExpired = percent <= 0;

  return (
    <div className="space-y-4">
      {/* Badge Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            <Zap className="w-3 h-3" />
            <span>Story Active</span>
          </div>
          {story.title && (
            <span className="text-sm font-semibold text-slate-700 truncate max-w-[180px]">
              {story.title}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-slate-400">
          {sortedItems.length} image{sortedItems.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Carousel Preview */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[9/14] max-w-[280px] mx-auto shadow-xl">
        {/* Progress bars */}
        <div className="absolute top-2 left-3 right-3 z-20 flex gap-1">
          {sortedItems.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/30"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  index < currentSlide
                    ? "bg-white w-full"
                    : index === currentSlide
                      ? "bg-white w-full"
                      : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Vendor Info overlay */}
        <div className="absolute top-5 left-3 z-20 flex items-center gap-2">
          {story.vendor?.logoUrl && (
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/80 shadow-sm">
              <Image
                src={story.vendor.logoUrl}
                alt={story.vendor.name || ""}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <span className="text-xs font-bold text-white drop-shadow-md">
            {story.vendor?.name || "Ma boutique"}
          </span>
        </div>

        {/* Image */}
        {sortedItems[currentSlide] && (
          <Image
            src={sortedItems[currentSlide].imageUrl}
            alt={sortedItems[currentSlide].caption || `Slide ${currentSlide + 1}`}
            fill
            className="object-cover"
          />
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Caption */}
        {sortedItems[currentSlide]?.caption && (
          <div className="absolute bottom-4 left-3 right-3 z-20">
            <p className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
              {sortedItems[currentSlide].caption}
            </p>
          </div>
        )}

        {/* Navigation */}
        {sortedItems.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Countdown Timer */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Clock className="w-4 h-4 text-green-500" />
            <span>Temps restant</span>
          </div>
          <span
            className={`text-xs font-black tabular-nums ${
              isExpired
                ? "text-red-600"
                : hours < 2
                  ? "text-amber-600"
                  : "text-green-600"
            }`}
          >
            {isExpired
              ? "Expirée"
              : `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isExpired
                ? "bg-red-500"
                : percent < 20
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-green-400 to-green-600"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-right">
          Publiée le{" "}
          {new Date(story.createdAt).toLocaleString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`/products/ui/page/${story.vendorId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Voir sur le site</span>
        </a>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Supprimer</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Supprimer cette Flash Story ?
              </h3>
              <p className="text-sm text-slate-500">
                Cette action est irréversible. Vos images et la story seront
                définitivement supprimées.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
