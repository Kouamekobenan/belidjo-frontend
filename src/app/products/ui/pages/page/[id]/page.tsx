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
} from "lucide-react";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import { FindByIdProductUseCase } from "@/app/products/application/usecases/find-byId.usecase";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import VendorNavBar from "@/app/components/layout/Vendor-NavBar";
import { useAuth } from "@/app/context/AuthContext";
import { IComment } from "@/app/lib/globals.type";
import { api } from "@/app/lib/api";

// --- Configuration de la Logique Métier ---
const repository = new ProductRepository();
const findProductById = new FindByIdProductUseCase(repository);

// Définition de la couleur de base pour la cohérence
const PRIMARY_COLOR = "text-teal-600";
const PRIMARY_BG = "bg-teal-600";
const HOVER_BG = "hover:bg-teal-700";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : null;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const handleComment = async () => {
    // Vérifier l'authentification
    if (!isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push("/users/ui/login");
      return;
    }

    // Validation du commentaire
    if (!commentContent.trim()) {
      setCommentError("Veuillez entrer un commentaire");
      return;
    }

    if (commentContent.trim().length < 3) {
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

      // Ajouter le nouveau commentaire à la liste locale
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
          comment: [...(product.comment || []), newComment],
        });
      }

      // Réinitialiser le champ de commentaire
      setCommentContent("");
      setCommentError(null);
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
      setCommentError(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'envoi du commentaire"
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

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
        console.error("Erreur lors du chargement du produit:", err);
        setError(err.message || "Une erreur inattendue est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fonction pour vérifier l'authentification et commander via WhatsApp
  const handleWhatsAppOrder = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push("/users/ui/login");
      return;
    }
    if (!product) return;
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par ce produit :\n\n` +
        `📦 *${product.name}*\n` +
        `💰 Prix : ${product.price.toLocaleString()} FCFA\n` +
        `📝 Description : ${product.description || "Non spécifiée"}\n\n` +
        `Je souhaite passer une commande.`
    );
    const phoneNumber = "225" + product.vendor.user?.phone;
    if (!phoneNumber) {
      alert("Numéro de téléphone du vendeur non disponible.");
      return;
    }
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  // --- États de Chargement et Erreur ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Erreur</h2>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-700">Produit introuvable</p>
        </div>
      </div>
    );
  }

  const stockStatus = product.quantity < 5 ? "Stock limité" : "En stock";
  const stockColor =
    product.quantity < 5
      ? "text-orange-600 bg-orange-50"
      : "text-teal-600 bg-teal-50";

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Carte Principale du Produit */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6 lg:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Section Image */}
            <div className="relative bg-gray-50 p-4 sm:p-6 lg:p-12 flex items-center justify-center border-b lg:border-r lg:border-b-0 border-gray-100">
              <div className="relative w-full h-64 sm:h-80 lg:h-[500px] flex items-center justify-center">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={`Image du produit ${product.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ objectFit: "contain" }}
                    className="drop-shadow-xl"
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center h-full text-gray-300">
                    <Package className="w-20 h-20 mb-4" />
                    <p className="text-lg">Image non disponible</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section Informations */}
            <div className="p-4 sm:p-6 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold ${stockColor}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor: stockColor.includes("orange")
                          ? "orange"
                          : "#047857",
                      }}
                    ></span>
                    {stockStatus}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                    {"Non catégorisé"}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3 lg:mb-4 leading-snug">
                  {product.name}
                </h1>

                {/* Prix */}
                <div className="mb-4 lg:mb-6">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-teal-600 mb-1">
                    {product.price.toLocaleString()}{" "}
                    <span className="text-lg sm:text-xl font-normal text-gray-500">
                      FCFA
                    </span>
                  </p>
                </div>

                {/* Description */}
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 lg:mb-3 border-l-4 border-teal-500 pl-3">
                    Description
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {product.description ||
                      "Aucune description fournie pour ce produit."}
                  </p>
                </div>

                {/* Quantité & Vendeur */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4 text-center mt-4 lg:mt-6">
                  <div className="bg-blue-50 rounded-lg lg:rounded-xl p-3 lg:p-4 shadow-sm border border-blue-100">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">
                      Quantité en stock
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-green-700 mt-1">
                      {product.quantity}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg lg:rounded-xl p-3 lg:p-4 shadow-sm border border-teal-100">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">
                      Vendeur
                    </p>
                    <p className="text-base sm:text-lg font-bold text-teal-700 mt-1 truncate">
                      {product.vendor.user?.name || "Inconnu"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Actions */}
              <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-100">
                <button
                  onClick={handleWhatsAppOrder}
                  className={`w-full cursor-pointer bg-gradient-to-r from-teal-600 to-teal-700 ${HOVER_BG} text-white font-bold py-3 sm:py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl`}
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  Commander via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Section Commentaires */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 lg:mb-8">
            <MessageSquare
              className={`w-6 h-6 sm:w-8 sm:h-8 ${PRIMARY_COLOR}`}
            />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Commentaires
              {product?.comment && product.comment.length > 0 && (
                <span className="ml-2 sm:ml-3 text-base sm:text-lg font-normal text-gray-500">
                  ({product.comment.length})
                </span>
              )}
            </h2>
          </div>
          {/* Formulaire d'ajout de commentaire */}
          <div className="mb-6 lg:mb-8">
            {isAuthenticated ? (
              <div className="space-y-3 lg:space-y-4">
                <div className="relative">
                  <textarea
                    value={commentContent}
                    onChange={(e) => {
                      setCommentContent(e.target.value);
                      setCommentError(null);
                    }}
                    placeholder="Laissez votre avis sur ce produit..."
                    rows={3}
                    className="w-full px-4 py-3 text-black text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 resize-none"
                    disabled={isSubmittingComment}
                  />
                </div>

                {commentError && (
                  <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{commentError}</span>
                  </div>
                )}

                <button
                  onClick={handleComment}
                  disabled={isSubmittingComment || !commentContent.trim()}
                  className={`w-full sm:w-auto ${PRIMARY_BG} ${HOVER_BG} text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmittingComment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      Publier le commentaire
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-4 sm:p-6 text-center">
                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600 mx-auto mb-3" />
                <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                  Connectez-vous pour laisser un commentaire
                </p>
                <button
                  onClick={() => {
                    sessionStorage.setItem(
                      "redirectAfterLogin",
                      window.location.pathname
                    );
                    router.push("/users/ui/login");
                  }}
                  className={`${PRIMARY_BG} ${HOVER_BG} text-white font-semibold py-2 sm:py-2.5 px-5 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base`}
                >
                  Se connecter
                </button>
              </div>
            )}
          </div>

          {/* Liste des commentaires */}
          {product?.comment && product.comment.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {product.comment.map((comment, index) => (
                <div
                  key={comment.id || index}
                  className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${PRIMARY_BG} flex items-center justify-center text-white font-bold text-xs sm:text-sm`}
                      >
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">
                        {comment.content}
                      </p>
                      {comment.createdAt && (
                        <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-gray-200">
              <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">
                Aucun commentaire pour le moment
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                Soyez le premier à laisser un avis !
              </p>
            </div>
          )}
        </div>

        {/* Espace pour éviter que le FAB ne masque le contenu */}
        <div className="lg:hidden h-20"></div>
      </div>

      {/* Bouton d'Appel Flottant Mobile */}
      {product.vendor.user?.phone && (
        <a
          href={`tel:${product.vendor.user.phone}`}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 sm:w-16 sm:h-16 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 z-50 animate-pulse-slow"
          aria-label={`Appeler le vendeur au ${product.vendor.user.phone}`}
        >
          <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
        </a>
      )}

      {/* Bouton d'Appel Desktop */}
      {product.vendor.user?.phone && (
        <div className="hidden lg:block fixed bottom-8 right-8 z-50">
          <a
            href={`tel:${product.vendor.user.phone}`}
            className="cursor-pointer bg-white border border-teal-500 text-teal-500 font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-teal-50 transition-all duration-200 flex items-center justify-center gap-3 text-lg whitespace-nowrap"
            aria-label={`Appeler le vendeur au ${product.vendor.user.phone}`}
          >
            <Phone className="w-5 h-5" />
            Appeler le Vendeur
          </a>
        </div>
      )}
    </div>
  );
}
