"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Clock,
  Pause,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FlashStoryEntity } from "@/app/flash-story/domain/entities/flash-story.entity";

const SLIDE_DURATION = 5000; // 5 secondes par slide

interface FlashStoryViewerProps {
  stories: FlashStoryEntity[];
  initialStoryIndex: number;
  onClose: () => void;
}

export default function FlashStoryViewer({
  stories,
  initialStoryIndex,
  onClose,
}: FlashStoryViewerProps) {
  const [storyIndex, setStoryIndex] = useState(initialStoryIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStory = stories[storyIndex];
  const sortedItems = currentStory
    ? [...currentStory.items].sort((a, b) => a.orderIndex - b.orderIndex)
    : [];
  const currentItem = sortedItems[slideIndex];

  // Progression automatique du slide
  const animate = useCallback(() => {
    if (isPaused) {
      animFrameRef.current = requestAnimationFrame(animate);
      lastTimeRef.current = Date.now();
      return;
    }

    const now = Date.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    progressRef.current += delta;
    const pct = Math.min(100, (progressRef.current / SLIDE_DURATION) * 100);
    setProgress(pct);

    if (progressRef.current >= SLIDE_DURATION) {
      // Slide suivant
      if (slideIndex < sortedItems.length - 1) {
        setSlideIndex((prev) => prev + 1);
        progressRef.current = 0;
        setProgress(0);
      } else if (storyIndex < stories.length - 1) {
        // Story suivante
        setStoryIndex((prev) => prev + 1);
        setSlideIndex(0);
        progressRef.current = 0;
        setProgress(0);
      } else {
        // Fin de toutes les stories
        onClose();
        return;
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isPaused, slideIndex, storyIndex, sortedItems.length, stories.length, onClose]);

  useEffect(() => {
    lastTimeRef.current = Date.now();
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animate]);

  // Reset progress on slide/story change
  useEffect(() => {
    progressRef.current = 0;
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, [slideIndex, storyIndex]);

  // Navigation : tap gauche / droite
  const handleTap = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) {
      // Tap gauche → slide précédent
      if (slideIndex > 0) {
        setSlideIndex((prev) => prev - 1);
      } else if (storyIndex > 0) {
        setStoryIndex((prev) => prev - 1);
        const prevStory = stories[storyIndex - 1];
        setSlideIndex(prevStory.items.length - 1);
      }
    } else if (x > third * 2) {
      // Tap droite → slide suivant
      if (slideIndex < sortedItems.length - 1) {
        setSlideIndex((prev) => prev + 1);
      } else if (storyIndex < stories.length - 1) {
        setStoryIndex((prev) => prev + 1);
        setSlideIndex(0);
      } else {
        onClose();
      }
    }
  };

  // Navigation par boutons
  const goPrevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
      setSlideIndex(0);
    }
  };

  const goNextStory = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex((prev) => prev + 1);
      setSlideIndex(0);
    } else {
      onClose();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrevStory();
      if (e.key === "ArrowRight") goNextStory();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [storyIndex, stories.length]);

  // Verrouiller le scroll du body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!currentStory || !currentItem) return null;

  // Calcul du temps restant
  const expiresAt = new Date(currentStory.expiresAt).getTime();
  const now = Date.now();
  const remainingMs = Math.max(0, expiresAt - now);
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-label="Flash Story Viewer"
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Navigation Story Précédente (Desktop) */}
      {storyIndex > 0 && (
        <button
          onClick={goPrevStory}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="Story précédente"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Navigation Story Suivante (Desktop) */}
      {storyIndex < stories.length - 1 && (
        <button
          onClick={goNextStory}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="Story suivante"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Container */}
      <div
        className="relative w-full max-w-[420px] h-[85vh] max-h-[780px] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl cursor-pointer select-none"
        onClick={handleTap}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1">
          {sortedItems.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/25"
            >
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    index < slideIndex
                      ? "100%"
                      : index === slideIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header — Vendor Info */}
        <div className="absolute top-7 left-3 right-14 z-30 flex items-center gap-2.5">
          {/* Avatar */}
          <Link
            href={`/products/ui/page/${currentStory.vendorId}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60 shadow-md">
              {currentStory.vendor?.logoUrl ? (
                <Image
                  src={currentStory.vendor.logoUrl}
                  alt={currentStory.vendor.name || ""}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                  {currentStory.vendor?.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              href={`/products/ui/page/${currentStory.vendorId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-bold text-white truncate drop-shadow-md hover:underline">
                {currentStory.vendor?.name || "Boutique"}
              </p>
            </Link>
            <div className="flex items-center gap-1.5 text-[10px] text-white/60">
              <Clock className="w-3 h-3" />
              <span>
                il y a{" "}
                {24 - remainingHours > 0 ? `${24 - remainingHours}h` : "quelques minutes"}
              </span>
            </div>
          </div>

          {/* Pause/Play indicator */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused((prev) => !prev);
            }}
            className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Image */}
        <Image
          src={currentItem.imageUrl}
          alt={currentItem.caption || `Story ${storyIndex + 1}`}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 space-y-3">
          {/* Story title */}
          {currentStory.title && slideIndex === 0 && (
            <h3 className="text-lg font-bold text-white drop-shadow-lg">
              {currentStory.title}
            </h3>
          )}

          {/* Caption */}
          {currentItem.caption && (
            <p className="text-sm text-white/90 font-medium bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2 drop-shadow-md">
              {currentItem.caption}
            </p>
          )}

          {/* CTA — Voir le produit */}
          {currentItem.productId && (
            <Link
              href={`/products/ui/page/${currentStory.vendorId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-green-50 transition-all shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Voir le produit</span>
            </Link>
          )}

          {/* Counter indicator */}
          <div className="flex items-center justify-center gap-1 py-1">
            <p className="text-[10px] text-white/40 font-medium">
              {storyIndex + 1}/{stories.length} •{" "}
              {remainingHours}h{String(remainingMinutes).padStart(2, "0")} restant
            </p>
          </div>
        </div>
      </div>

      {/* Story dots (below on mobile) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setStoryIndex(index);
              setSlideIndex(0);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === storyIndex
                ? "bg-white scale-110"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
