"use client";

import React, { useState, useEffect, useRef } from "react";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { FlashStoryEntity } from "@/app/flash-story/domain/entities/flash-story.entity";
import { FlashStoryRepository } from "@/app/flash-story/infrastructure/api/flash-story.api";
import { GetAllFlashStoriesUseCase } from "@/app/flash-story/application/usecases/get-all-flash-stories.usecase";
import FlashStoryViewer from "./FlashStoryViewer";

const repo = new FlashStoryRepository();
const getAllFlashStories = new GetAllFlashStoriesUseCase(repo);

export default function FlashStoryBar() {
  const [stories, setStories] = useState<FlashStoryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const result = await getAllFlashStories.execute(50, 1);
        setStories(result.data);
      } catch (error) {
        console.error("Erreur chargement Flash Stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  // Check scroll abilities
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [stories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const openViewer = (index: number) => {
    setSelectedIndex(index);
    setViewerOpen(true);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full bg-white border-b border-slate-100 pt-14 md:pt-[88px]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 animate-pulse">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-slate-200" />
                <div className="h-2.5 bg-slate-200 rounded-full w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Aucune story à afficher
  if (stories.length === 0) return null;

  return (
    <>
      <section className="w-full bg-white border-b border-slate-100 relative py-2">
        <div className="max-w-7xl mx-auto relative">
          {/* Header label */}
          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Bons Plans Express
            </span>
            <div className="flex-1 h-px bg-slate-100 ml-2" />
          </div>

          {/* Scroll buttons (Desktop) */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-1/2 translate-y-1 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center text-slate-600 hover:text-slate-900 shadow-lg border border-slate-200 transition-all"
              aria-label="Défiler à gauche"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-1/2 translate-y-1 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center text-slate-600 hover:text-slate-900 shadow-lg border border-slate-200 transition-all"
              aria-label="Défiler à droite"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Gradient Faders */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          )}

          {/* Stories Scroll Area */}
          <div
            ref={scrollRef}
            className="flex gap-4 px-4 pb-4 pt-1 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {stories.map((story, index) => {
              const firstImage = [...story.items].sort(
                (a, b) => a.orderIndex - b.orderIndex,
              )[0];

              return (
                <button
                  key={story.id}
                  onClick={() => openViewer(index)}
                  className="group flex flex-col items-center gap-1.5 shrink-0 focus:outline-none"
                >
                  {/* Avatar Ring */}
                  <div className="relative">
                    {/* Gradient Ring Animation */}
                    <div className="w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full p-[3px] bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 group-hover:from-green-400 group-hover:via-green-500 group-hover:to-green-600 transition-all duration-500 group-hover:scale-105">
                      <div className="w-full h-full rounded-full p-[2px] bg-white">
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                          {story.vendor?.logoUrl ? (
                            <Image
                              src={story.vendor.logoUrl}
                              alt={story.vendor.name || "Vendeur"}
                              width={72}
                              height={72}
                              className="object-cover w-full h-full"
                            />
                          ) : firstImage ? (
                            <Image
                              src={firstImage.imageUrl}
                              alt="Story"
                              width={72}
                              height={72}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 text-green-600 text-lg font-bold">
                              {story.vendor?.name?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Story count badge */}
                    {story.items.length > 1 && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">
                          {story.items.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Vendor Name */}
                  <span className="text-[11px] font-semibold text-slate-600 group-hover:text-green-600 transition-colors max-w-[72px] truncate text-center">
                    {story.vendor?.name || "Boutique"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Viewer Fullscreen */}
      {viewerOpen && (
        <FlashStoryViewer
          stories={stories}
          initialStoryIndex={selectedIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
