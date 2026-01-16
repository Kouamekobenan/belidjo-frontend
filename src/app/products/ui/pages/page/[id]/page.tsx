"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Package,
  MessageSquare,
  AlertCircle,
  Phone,
  Tag,
  Send,
  User,
  Plus,
  Minus,
  ChevronLeft,
} from "lucide-react";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import { FindByIdProductUseCase } from "@/app/products/application/usecases/find-byId.usecase";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import VendorNavBar from "@/app/components/layout/Vendor-NavBar";
import { useAuth } from "@/app/context/AuthContext";
import { IComment } from "@/app/lib/globals.type";
import { api } from "@/app/lib/api";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";

// --- Configuration ---
const repository = new ProductRepository(new ProductMapper());
const findProductById = new FindByIdProductUseCase(repository);

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : null;

  // --- Chargement du produit ---
  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Identifiant de produit manquant.");
      return;
    }
    const fetchProduct = async () => {
      try {
        const data = await findProductById.execute(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors du chargement.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- Gestion des commentaires ---
  const handleComment = async () => {
    if (!isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push("/users/ui/login");
      return;
    }

    if (!commentContent.trim() || commentContent.trim().length < 3) {
      setCommentError("Le commentaire doit contenir au moins 3 caractères");
      return;
    }

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const res = await api.post("/comment", {
        content: commentContent.trim(),
        productId: id,
        userId: user?.id,
      });

      if (product && res.data) {
        const newComment: IComment = {
          id: res.data.id || Date.now().toString(),
          content: commentContent.trim(),
          productId: id || "",
          userId: user?.id || "",
          createdAt: new Date().toISOString(),
        };

        setProduct({
          ...product,
          comment: [newComment, ...(product.comment || [])], // Nouveau commentaire en haut
        });
      }

      setCommentContent("");
      setShowCommentForm(false);
    } catch (error: any) {
      setCommentError(
        error.response?.data?.message || "Erreur lors de l'envoi."
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // --- Commande WhatsApp ---
  const handleWhatsAppOrder = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push("/users/ui/login");
      return;
    }
    if (!product) return;

    const productUrl = window.location.href;
    const phoneNumber =
      "225" + product.vendor.user?.phone?.replace(/[\s\-\(\)]/g, "");
    const message = encodeURIComponent(
      `Bonjour, je souhaite commander :\n📦 *${
        product.name
      }*\n💰 *${product.price.toLocaleString()} FCFA*\n\nLien : ${productUrl}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Chargement du produit...
        </p>
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Oups !</h2>
          <p className="text-gray-500 mt-2 text-sm">
            {error || "Produit introuvable"}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold"
          >
            Retour
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-12">
      <VendorNavBar />

      <main className="max-w-7xl mx-auto lg:px-8 lg:py-10">
        <div className="bg-white lg:rounded-[40px] lg:shadow-2xl lg:border lg:border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* --- SECTION IMAGE (Haute sur mobile) --- */}
            <div className="relative p-4  bg-gray-100">
              <div className="relative w-full rounded-2xl  h-[50vh] sm:h-[500px] lg:h-[650px]">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover rounded-2xl lg:object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Package className="w-20 h-20" />
                    <p>Aucune image</p>
                  </div>
                )}
              </div>
              <div className="absolute top-4 left-4 lg:hidden">
                <button
                  onClick={() => router.back()}
                  className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg text-gray-900"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* --- SECTION INFOS --- */}
            <div className="p-6 lg:p-14 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    product.quantity < 5
                      ? "bg-orange-500 text-white"
                      : "bg-teal-600 text-white"
                  }`}
                >
                  {product.quantity < 5 ? "Stock Limité" : "En Stock"}
                </span>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Produit vérifié
                </span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl lg:text-5xl font-black text-teal-600">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-gray-400">FCFA</span>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {product.description || "Description non disponible."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Stock
                    </p>
                    <p className="text-2xl font-black text-gray-800">
                      {product.quantity}
                    </p>
                  </div>
                  <div className="p-5 bg-teal-50 rounded-3xl border border-teal-100">
                    <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">
                      Boutique
                    </p>
                    <p className="text-sm font-bold text-teal-700 truncate">
                      {product.vendor.user?.name || "Boutique Officielle"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="hidden lg:flex mt-12 w-full bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-3xl font-black text-xl items-center justify-center gap-4 transition-all hover:scale-[1.02] shadow-2xl shadow-teal-200"
              >
                <ShoppingCart className="w-7 h-7" />
                Commander maintenant
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION COMMENTAIRES --- */}
        <section className="mt-12 px-4 lg:px-0 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-teal-600" />
              Avis Clients
              <span className="text-gray-300 font-medium">
                ({product.comment?.length || 0})
              </span>
            </h2>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  sessionStorage.setItem(
                    "redirectAfterLogin",
                    window.location.pathname
                  );
                  router.push("/users/ui/login");
                } else {
                  setShowCommentForm(!showCommentForm);
                }
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                showCommentForm
                  ? "bg-red-50 text-red-600"
                  : "bg-white text-teal-600 border border-teal-100"
              }`}
            >
              {showCommentForm ? (
                <>
                  <Minus className="w-4 h-4" /> Annuler
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Ajouter un avis
                </>
              )}
            </button>
          </div>

          {showCommentForm && (
            <div className="mb-10 p-6 bg-white rounded-[32px] border-2 border-teal-50 shadow-xl shadow-teal-50/50 animate-in fade-in slide-in-from-top-4 duration-300">
              <textarea
                value={commentContent}
                onChange={(e) => {
                  setCommentContent(e.target.value);
                  setCommentError(null);
                }}
                placeholder="Dites-nous ce que vous pensez de ce produit..."
                className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 text-gray-800 min-h-[120px] text-lg"
              />
              {commentError && (
                <p className="mt-2 text-red-500 text-xs px-2">{commentError}</p>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleComment}
                  disabled={isSubmittingComment || !commentContent.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg shadow-teal-100"
                >
                  {isSubmittingComment ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Publier l'avis
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {product.comment && product.comment.length > 0 ? (
              product.comment.map((comment, index) => (
                <div
                  key={comment.id || index}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-hover hover:shadow-md"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">Client Anonyme</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest italic">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString(
                              "fr-FR"
                            )
                          : "Récemment"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic text-lg">
                    "{comment.content}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">
                  Soyez le premier à donner votre avis !
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- BARRE D'ACTION MOBILE FIXE --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50">
        <div className="max-w-md mx-auto flex gap-4">
          {product.vendor.user?.phone && (
            <a
              href={`tel:${product.vendor.user.phone}`}
              className="flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-900 rounded-[24px] active:scale-90 transition-transform"
            >
              <Phone className="w-7 h-7" />
            </a>
          )}
          <button
            onClick={handleWhatsAppOrder}
            className="flex-1 bg-teal-600 text-white font-black rounded-[24px] flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-2xl shadow-teal-200"
          >
            <ShoppingCart className="w-6 h-6" />
            Commander via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
