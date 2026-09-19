"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { FlashStoryEntity } from "@/app/flash-story/domain/entities/flash-story.entity";
import { FlashStoryRepository } from "@/app/flash-story/infrastructure/api/flash-story.api";
import { GetVendorFlashStoryUseCase } from "@/app/flash-story/application/usecases/get-vendor-flash-story.usecase";
import FlashStoryCreateForm from "./FlashStoryCreateForm";
import FlashStoryPreview from "./FlashStoryPreview";

const repo = new FlashStoryRepository();
const getVendorFlashStory = new GetVendorFlashStoryUseCase(repo);

export default function FlashStoryManager() {
  const { user } = useAuth();
  const vendorId = user?.vendorProfile?.id;

  const [activeStory, setActiveStory] = useState<FlashStoryEntity | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveStory = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const story = await getVendorFlashStory.execute(vendorId);
      setActiveStory(story);
    } catch (error) {
      console.error("Erreur chargement Flash Story:", error);
      setActiveStory(null);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchActiveStory();
  }, [fetchActiveStory]);

  if (!vendorId) return null;

  return (
    <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              {activeStory && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Flash Story
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {activeStory
                  ? "Votre story est visible par vos clients"
                  : "Publiez une story éphémère de 24h"}
              </p>
            </div>
          </div>

          {activeStory && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              En ligne
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin mb-3" />
            <p className="text-sm text-slate-400 font-medium">
              Chargement de votre Flash Story...
            </p>
          </div>
        ) : activeStory ? (
          /* Active Story → Preview & Manage */
          <FlashStoryPreview
            story={activeStory}
            onDeleted={() => {
              setActiveStory(null);
            }}
          />
        ) : (
          /* No Active Story → Create Form */
          <FlashStoryCreateForm
            vendorId={vendorId}
            onCreated={(story) => {
              setActiveStory(story);
            }}
          />
        )}
      </div>
    </section>
  );
}
