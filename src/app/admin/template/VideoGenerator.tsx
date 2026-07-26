"use client";
import { Player } from "@remotion/player";
import { MyVideoTemplate } from "./MyVideoTemplate";
import { useState, useEffect } from "react";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";
import { GetProductsByVendorUseCase } from "@/app/products/application/usecases/get-product.usecase";
import { useAuth } from "@/app/context/AuthContext";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import Link from "next/link";
import { CheckCircle, Download, AlertCircle, RefreshCw } from "lucide-react";
import { useVideoExport } from "./hooks/useVideoExport";

const repo = new ProductRepository(new ProductMapper());
const getProductsUseCase = new GetProductsByVendorUseCase(repo);

const audioOptions = [
  { id: "1", name: "Afrobeat 1", url: "/music/af.mpeg", bpm: 115 },
  { id: "2", name: "Smooth Luxe", url: "/music/aff.mpeg", bpm: 90 },
  { id: "3", name: "Urban 1", url: "/music/affrobeat.mpeg", bpm: 105 },
  { id: "4", name: "Urban 2", url: "/music/afro.mpeg", bpm: 105 },
  { id: "5", name: "Urban 3", url: "/music/beat.mpeg", bpm: 105 },
];

export default function VideoGenerator() {
  const { user } = useAuth();
  const [vendorProducts, setVendorProducts] = useState<IProduct[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudio, setSelectedAudio] = useState(audioOptions[0]);

  const { exportVideo, progress, status, isExporting, error, videoUrl, reset } =
    useVideoExport();

  const vendorId = user?.vendorProfile?.id;
  const itemsPerPage = 12;

  useEffect(() => {
    if (vendorId) fetchProducts(currentPage);
  }, [vendorId, currentPage]);

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getProductsUseCase.execute(vendorId!, itemsPerPage, page);
      setVendorProducts(res.data);
      setTotalPages(Math.ceil(res.total / itemsPerPage));
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
    }
  };

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageUrl)) return prev.filter((img) => img !== imageUrl);
      if (prev.length >= 10) return prev;
      return [...prev, imageUrl];
    });
  };

  const handleGenerate = () => {
    const prices = selectedImages.map((url) => {
      const product = vendorProducts.find((p) => p.imageUrl === url);
      return product?.price ?? 0;
    });
    exportVideo(
      selectedImages,
      prices,
      user?.vendorProfile?.name || "Noboutik",
      selectedAudio.url,
    );
  };

  const filteredProducts = vendorProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Durée estimée : 1 rendu canvas (~12s pour 10 imgs) + encodage (~15s) = rough estimate
  const estimatedSeconds = selectedImages.length * 3 + 15;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <Link
            href="/admin/ui"
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all shadow-md hover:shadow-lg w-full md:w-auto justify-center md:justify-start"
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-teal-600 group-hover:-translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">
              Retour
            </span>
          </Link>

          <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-3 bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Créateur de Clip Magique
            </h1>
            <div className="h-1.5 bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 rounded-full max-w-xs mx-auto" />
            <p className="text-gray-600 mt-4 text-sm md:text-lg">
              Vendez plus avec une vidéo pro en 2 clics
            </p>
          </div>

          <div className="hidden md:block md:w-[140px]" />
        </div>

        {/* ── BANNIÈRE SUCCÈS ── */}
        {videoUrl && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Vidéo générée avec succès !
                </h3>
                <p className="text-green-700 mb-4">
                  Votre vidéo promotionnelle est prête. Téléchargez-la et partagez-la sur vos réseaux.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={videoUrl}
                    download={`promo-${user?.vendorProfile?.name ?? "noboutik"}.mp4`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    Télécharger la vidéo (.mp4)
                  </a>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-white text-green-700 font-semibold rounded-xl border-2 border-green-300 hover:bg-green-50 transition-all"
                  >
                    Créer une nouvelle vidéo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BANNIÈRE ERREUR ── */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-800 mb-2">Erreur de génération</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-white text-red-700 font-semibold rounded-xl border-2 border-red-300 hover:bg-red-50 transition-all"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROGRESS BAR ── */}
        {isExporting && (
          <div className="mb-6 bg-white border-2 border-teal-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-teal-600 animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">Génération en cours...</p>
                <p className="text-sm text-gray-500 truncate">{status}</p>
              </div>
              <span className="text-2xl font-black text-teal-600 flex-shrink-0">{progress}%</span>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              Durée estimée ≈ {Math.ceil(estimatedSeconds / images_count_ref(selectedImages))}s par image
              · Ne fermez pas l&apos;onglet
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Sélectionnés</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {selectedImages.length}/10
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Durée estimée</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {selectedImages.length > 0 ? selectedImages.length * 3 : 10}s
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* SECTION GAUCHE */}
          <div className="lg:col-span-3 space-y-6">
            {/* GRILLE PRODUITS */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-6">
                <h3 className="font-bold text-white text-xl flex items-center gap-3">
                  <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    🛍️
                  </span>
                  1. Choisissez vos produits vedettes
                </h3>
                <p className="text-teal-50 mt-2 text-sm">
                  Sélectionnez jusqu&apos;à 10 produits ({selectedImages.length}/10)
                </p>
              </div>

              <div className="p-6 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all text-gray-700"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Chargement des produits...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 font-medium text-lg">Aucun produit trouvé</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => {
                      const isSelected = selectedImages.includes(product.imageUrl);
                      const selectionIndex = selectedImages.indexOf(product.imageUrl);
                      return (
                        <div
                          key={product.id}
                          onClick={() => toggleImageSelection(product.imageUrl)}
                          className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            isSelected
                              ? "ring-4 ring-teal-500 shadow-2xl shadow-teal-200"
                              : "hover:shadow-xl"
                          }`}
                        >
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              <p className="font-semibold text-sm truncate">{product.name}</p>
                              <p className="text-xs text-teal-300 font-bold">
                                {product.price} FCFA
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-teal-500 to-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                              {selectionIndex + 1}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && !isLoading && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 font-medium">
                        Page {currentPage} sur {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => goToPage(1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                          ⏮️
                        </button>
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                        >
                          ← Précédent
                        </button>
                        <div className="hidden md:flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                              (p) =>
                                p === 1 ||
                                p === totalPages ||
                                (p >= currentPage - 1 && p <= currentPage + 1),
                            )
                            .map((page, index, array) => {
                              const showEllipsis = index > 0 && page - array[index - 1] > 1;
                              return (
                                <div key={page} className="flex items-center gap-1">
                                  {showEllipsis && (
                                    <span className="px-2 text-gray-400">...</span>
                                  )}
                                  <button
                                    onClick={() => goToPage(page)}
                                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                      currentPage === page
                                        ? "bg-gradient-to-br from-teal-500 to-green-500 text-white shadow-lg scale-110"
                                        : "border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 text-gray-700"
                                    }`}
                                  >
                                    {page}
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
                        >
                          Suivant →
                        </button>
                        <button
                          onClick={() => goToPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                          ⏭️
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MUSIQUE */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-xl">
                🎵 2. Choisissez l&apos;ambiance musicale
              </h3>
              <div className="flex flex-wrap gap-3">
                {audioOptions.map((audio) => (
                  <button
                    key={audio.id}
                    onClick={() => setSelectedAudio(audio)}
                    className={`px-5 py-3 rounded-full border-2 transition-all font-medium ${
                      selectedAudio.id === audio.id
                        ? "bg-gradient-to-r from-teal-600 to-green-600 text-white border-teal-600 shadow-lg shadow-teal-200 scale-105"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    {selectedAudio.id === audio.id && "▶ "} {audio.name}
                  </button>
                ))}
              </div>
            </div>

            {/* BOUTON GÉNÉRER */}
            <button
              onClick={handleGenerate}
              disabled={isExporting || selectedImages.length === 0}
              className="w-full bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold shadow-2xl hover:shadow-teal-300 disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-300 disabled:shadow-none disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] text-lg group overflow-hidden relative"
            >
              <span className="relative z-10 flex flex-col items-center justify-center gap-2">
                {isExporting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{status || "Génération en cours..."}</span>
                    <span className="font-black">{progress}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎬</span>
                    {selectedImages.length === 0
                      ? "Sélectionnez des produits d'abord"
                      : `Générer ma Vidéo Promo (${selectedImages.length} produit${selectedImages.length > 1 ? "s" : ""})`}
                    {selectedImages.length > 0 && <span className="text-2xl">✨</span>}
                  </div>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            {selectedImages.length > 0 && !isExporting && !videoUrl && (
              <p className="text-center text-xs text-gray-400">
                Durée estimée de génération ≈ {estimatedSeconds}s — le fichier MP4 sera téléchargeable automatiquement.
              </p>
            )}
          </div>

          {/* SECTION DROITE : APERÇU */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 shadow-2xl border-4 border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold">
                      Aperçu en direct
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-red-400 font-semibold">LIVE</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                  <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
                    <Player
                      component={MyVideoTemplate}
                      durationInFrames={
                        selectedImages.length > 0 ? selectedImages.length * 90 : 300
                      }
                      compositionWidth={1080}
                      compositionHeight={1920}
                      fps={30}
                      controls
                      style={{ width: "100%", aspectRatio: "9/16", maxHeight: "650px" }}
                      inputProps={{
                        images:
                          selectedImages.length > 0
                            ? selectedImages
                            : ["/images/android-chrome-512x512.png"],
                        prices:
                          selectedImages.length > 0
                            ? selectedImages.map((url) => {
                                const p = vendorProducts.find((p) => p.imageUrl === url);
                                return p?.price ?? 0;
                              })
                            : [0],
                        shopName: user?.vendorProfile?.name || "Noboutik",
                        audioUrl: selectedAudio.url,
                        bpm: selectedAudio.bpm,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Résolution</p>
                    <p className="text-white font-bold">1080 × 1920</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Durée</p>
                    <p className="text-white font-bold">
                      {selectedImages.length > 0 ? selectedImages.length * 3 : 10}s
                    </p>
                  </div>
                </div>

                {selectedImages.length === 0 && (
                  <div className="mt-6 bg-teal-500/10 border border-teal-500/30 rounded-xl p-4">
                    <p className="text-teal-300 text-sm text-center font-medium">
                      👈 Sélectionnez des produits pour voir l&apos;aperçu
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// helper local pour éviter les divisions avec 0
function images_count_ref(images: string[]) {
  return Math.max(images.length, 1);
}
