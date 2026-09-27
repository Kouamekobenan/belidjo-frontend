"use client";

import React, { useState, useEffect } from "react";
import { PromoVideo, CreatePromoVideoDto } from "./domain/entities/promo-video.entity";
import { GetMyPromoVideoUseCase } from "./application/usecases/get-my-promo-video.usecase";
import { GeneratePromoVideoUseCase } from "./application/usecases/generate-promo-video.usecase";
import { promoVideoRepository } from "./infrastructure/api/promo-video.api";
import { useAuth } from "@/app/context/AuthContext";
import { GetProductsByVendorUseCase } from "@/app/products/application/usecases/get-product.usecase";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import {
  Sparkles,
  Video,
  Download,
  Share2,
  Clock,
  Music,
  Plus,
  Trash2,
  ShoppingBag,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  Film,
  Layers,
} from "lucide-react";

const repo = new ProductRepository(new ProductMapper());
const getProductsUseCase = new GetProductsByVendorUseCase(repo);

const presetAudioOptions = [
  { id: "1", name: "Afrobeat Rythmé (Par défaut)", url: "/music/af.mpeg", bpm: 115 },
  { id: "2", name: "Smooth Luxe & Chill", url: "/music/aff.mpeg", bpm: 90 },
  { id: "3", name: "Urban Commercial 1", url: "/music/affrobeat.mpeg", bpm: 105 },
  { id: "4", name: "Modern Pop Afro", url: "/music/afro.mpeg", bpm: 110 },
];

export default function VendorPromoVideoPage() {
  const { user } = useAuth();
  const [activeVideo, setActiveVideo] = useState<PromoVideo | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Vendor Catalog Selection
  const [vendorProducts, setVendorProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Form State
  const [shopName, setShopName] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [prices, setPrices] = useState<string[]>([""]);
  const [audioUrl, setAudioUrl] = useState(presetAudioOptions[0].url);
  const [bpm, setBpm] = useState<number | "">(presetAudioOptions[0].bpm);

  const getMyVideoUseCase = new GetMyPromoVideoUseCase(promoVideoRepository);
  const generateVideoUseCase = new GeneratePromoVideoUseCase(promoVideoRepository);

  const vendorId = user?.vendorProfile?.id;

  useEffect(() => {
    if (user?.vendorProfile?.name) {
      setShopName(user.vendorProfile.name);
    }
  }, [user]);

  useEffect(() => {
    fetchActiveVideo();
    if (vendorId) {
      fetchVendorProducts();
    }
  }, [vendorId]);

  const fetchActiveVideo = async () => {
    setLoadingInitial(true);
    setErrorMsg(null);
    try {
      const video = await getMyVideoUseCase.execute();
      if (video && video.videoUrl) {
        const expiresAt = new Date(video.expiresAt).getTime();
        const now = new Date().getTime();
        if (expiresAt > now) {
          setActiveVideo(video);
        } else {
          setActiveVideo(null);
        }
      } else {
        setActiveVideo(null);
      }
    } catch (err: any) {
      console.error("Erreur récupération vidéo active :", err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const fetchVendorProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await getProductsUseCase.execute(vendorId!, 30, 1);
      setVendorProducts(res.data || []);
    } catch (err) {
      console.error("Erreur chargement des produits du vendeur:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const toggleSelectProduct = (product: IProduct) => {
    if (selectedProductIds.includes(product.id)) {
      // Unselect
      const nextIds = selectedProductIds.filter((id) => id !== product.id);
      setSelectedProductIds(nextIds);
      rebuildFormFromSelectedIds(nextIds);
    } else {
      if (selectedProductIds.length >= 10) return;
      const nextIds = [...selectedProductIds, product.id];
      setSelectedProductIds(nextIds);
      rebuildFormFromSelectedIds(nextIds);
    }
  };

  const rebuildFormFromSelectedIds = (ids: string[]) => {
    const selectedProds = vendorProducts.filter((p) => ids.includes(p.id));
    if (selectedProds.length === 0) {
      setImages([""]);
      setPrices([""]);
      return;
    }
    setImages(selectedProds.map((p) => p.imageUrl || ""));
    setPrices(selectedProds.map((p) => p.price.toString()));
  };

  const handleAddImageField = () => {
    if (images.length < 10) {
      setImages([...images, ""]);
      setPrices([...prices, ""]);
    }
  };

  const handleRemoveImageField = (index: number) => {
    if (images.length > 1) {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);

      const newPrices = [...prices];
      newPrices.splice(index, 1);
      setPrices(newPrices);
    }
  };

  const handleImageChange = (index: number, val: string) => {
    const newImages = [...images];
    newImages[index] = val;
    setImages(newImages);
  };

  const handlePriceChange = (index: number, val: string) => {
    const newPrices = [...prices];
    newPrices[index] = val;
    setPrices(newPrices);
  };

  const handlePresetAudioChange = (opt: (typeof presetAudioOptions)[0]) => {
    setAudioUrl(opt.url);
    setBpm(opt.bpm);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const filteredImages = images.map((i) => i.trim()).filter((i) => i.length > 0);
    if (filteredImages.length === 0) {
      setErrorMsg("Veuillez sélectionner au moins 1 image produit.");
      return;
    }

    const filteredPrices = prices
      .map((p) => parseFloat(p))
      .filter((p) => !isNaN(p));

    const dto: CreatePromoVideoDto = {
      shopName: shopName.trim(),
      images: filteredImages,
      prices: filteredPrices.length > 0 ? filteredPrices : undefined,
      audioUrl: audioUrl.trim() ? audioUrl.trim() : undefined,
      bpm: typeof bpm === "number" && !isNaN(bpm) ? bpm : undefined,
    };

    setIsGenerating(true);
    try {
      const createdVideo = await generateVideoUseCase.execute(dto);
      setActiveVideo(createdVideo);
      setSuccessMsg("🎉 Votre vidéo promotionnelle a été générée avec succès !");
    } catch (err: any) {
      console.error("Erreur lors de la génération de la vidéo :", err);
      const serverMessage =
        err?.response?.data?.message || err.message || "Échec de la génération de la vidéo.";
      setErrorMsg(Array.isArray(serverMessage) ? serverMessage.join(", ") : serverMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateTimeRemaining = (expiresAtStr: string) => {
    const expiresAt = new Date(expiresAtStr).getTime();
    const now = new Date().getTime();
    const diff = expiresAt - now;
    if (diff <= 0) return "Expirée";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleShare = async () => {
    if (!activeVideo?.videoUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vidéo Promotionnelle - ${activeVideo.shopName}`,
          text: `Regardez la vidéo promotionnelle de ${activeVideo.shopName} !`,
          url: activeVideo.videoUrl,
        });
      } catch (err) {
        console.log("Partage annulé", err);
      }
    } else {
      await navigator.clipboard.writeText(activeVideo.videoUrl);
      alert("Lien de la vidéo copié dans le presse-papier !");
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <Zap className="w-6 h-6 text-indigo-400 absolute animate-pulse" />
        </div>
        <p className="text-slate-400 font-medium text-sm mt-4 tracking-wide">
          Chargement du Studio Marketing Pro...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER BRANDING */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-slate-800 p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Studio Vidéo Vendeur Pro
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Générateur de Clip Promotionnel
              </h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
                Créez une vidéo publicitaire dynamique HD basée sur vos produits pour booster vos storys et réseaux sociaux.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl">
              <Film className="w-8 h-8 text-indigo-400" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Format de rendu</span>
                <span className="text-xs font-bold text-white uppercase">1080x1920 HD (Format Story & Reel)</span>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white font-bold ml-4 text-lg">
              &times;
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white font-bold ml-4 text-lg">
              &times;
            </button>
          </div>
        )}

        {/* CASE 1: ACTIVE VIDEO PLAYER DISPLAY */}
        {activeVideo ? (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Vidéo en ligne</span>
                <h2 className="text-2xl font-bold text-white mt-0.5">{activeVideo.shopName}</h2>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl text-amber-400 text-xs font-semibold">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Expire dans : {calculateTimeRemaining(activeVideo.expiresAt)}</span>
              </div>
            </div>

            {/* VIDEO PLAYER PREVIEW */}
            <div className="relative max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl group">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>

            {/* BUTTON ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={activeVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                Télécharger la Vidéo HD
              </a>

              <button
                onClick={handleShare}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm px-6 py-3.5 rounded-2xl border border-slate-700 transition-all hover:scale-[1.02]"
              >
                <Share2 className="w-4 h-4" />
                Partager la vidéo
              </button>
            </div>

            <p className="text-center text-slate-500 text-xs mt-4">
              Pour des raisons d'optimisation serveur, vous disposez d'une vidéo promotionnelle active par tranche de 24h.
            </p>
          </div>
        ) : (
          /* CASE 2: CREATION FORM & CATALOG SELECTION */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: QUICK PRODUCT SELECTOR FROM CATALOG */}
            <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Vos Produits Boutique</h3>
                </div>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full font-bold">
                  {selectedProductIds.length}/10 sélectionnés
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Cliquez directement sur vos produits ci-dessous pour inclure automatiquement leurs visuels et prix dans la vidéo.
              </p>

              {loadingProducts ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-500">Chargement de votre catalogue...</span>
                </div>
              ) : vendorProducts.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 text-xs text-slate-500">
                  Aucun produit trouvé dans votre catalogue. Vous pouvez saisir les URLs des images manuellement.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                  {vendorProducts.map((product) => {
                    const isSelected = selectedProductIds.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => toggleSelectProduct(product)}
                        className={`relative group cursor-pointer p-2 rounded-2xl border transition-all flex flex-col items-center text-center ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10"
                            : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 mb-2">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-indigo-500 text-white rounded-full p-0.5 shadow-md">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-200 line-clamp-1 w-full">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-indigo-400 font-bold mt-0.5">
                          {product.price.toLocaleString("fr-FR")} FCFA
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: GENERATION FORM */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleGenerate}
                className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" /> Configurer le Rendu Vidéo
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Complétez les détails de votre boutique et la piste audio.
                  </p>
                </div>

                {/* SHOP NAME */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Nom de la boutique <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Ex: Boutique Élégance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* IMAGES & PRICES INPUT FIELDS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      URLs d'images & Prix ({images.length}/10) <span className="text-rose-500">*</span>
                    </label>
                    {images.length < 10 && (
                      <button
                        type="button"
                        onClick={handleAddImageField}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2.5 py-1 rounded-xl"
                      >
                        <Plus className="w-3.5 h-3.5" /> Ajouter
                      </button>
                    )}
                  </div>

                  {images.map((imgUrl, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-500 w-5 text-center">{index + 1}</span>
                      <input
                        type="url"
                        required
                        value={imgUrl}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="URL Image (ex: https://...)"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="number"
                        value={prices[index] || ""}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        placeholder="Prix FCFA"
                        className="w-28 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageField(index)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* AUDIO MUSIC CHOICE */}
                <div className="space-y-3 border-t border-slate-800/80 pt-4">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Music className="w-4 h-4 text-indigo-400" /> Ambiance Musicale (Audio)
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {presetAudioOptions.map((opt) => {
                      const isSelected = audioUrl === opt.url;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handlePresetAudioChange(opt)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-indigo-600/20 border-indigo-500 text-white"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Play className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-400" : "text-slate-600"}`} />
                            <span className="text-xs font-semibold">{opt.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{opt.bpm} BPM</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] ${
                      isGenerating ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Rendu vidéo Remotion en cours (patientez quelques secondes)...</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        <span>Générer ma Vidéo Promotionnelle HD</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
