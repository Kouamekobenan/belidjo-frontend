"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserRepository } from "@/app/users/infrastructure/user-repository.impl";
import { UserMapper } from "@/app/users/domain/mappers/user.mapper";
import { UpdateUserUseCase } from "@/app/users/application/usecases/update-user.usecase";
import { UpdateUserDto } from "@/app/users/application/dtos/update-user.dto";
import { api } from "@/app/lib/api";
import { ArrowLeft, Save, User as UserIcon, MapPin } from "lucide-react";
import { ICity } from "@/app/city/domain/interface/city";
import toast from "react-hot-toast";

const userRepo = new UserRepository(new UserMapper());
const updateUserUseCase = new UpdateUserUseCase(userRepo);

export default function SettingsProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<UpdateUserDto>({
    name: "",
    email: "",
    phone: "",
    cityId: "",
  });

  const [cities, setCities] = useState<ICity[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // 1. Récupération des villes et des données utilisateur en parallèle
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setFetching(true);

        // On lance les deux requêtes en parallèle pour gagner du temps
        const [citiesRes, userRes] = await Promise.all([
          api.get("/city"),
          api.get(`/users/${id}`),
        ]);

        // Mise à jour des villes (on vérifie la structure de ta réponse API)
        const cityListData = citiesRes.data.data || citiesRes.data;
        setCities(cityListData);

        // Pré-remplissage du formulaire
        const userData = userRes.data;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          cityId: userData.cityId || "", // L'ID sera automatiquement sélectionné dans le <select>
        });
      } catch (error) {
        console.error("Erreur de chargement:", error);
        toast.error("Erreur lors de la récupération des données.");
      } finally {
        setFetching(false);
      }
    };

    loadInitialData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, v]) => v !== undefined && v !== "",
        ),
      );

      await updateUserUseCase.execute(id as string, cleanData);
      toast.success("Profil mis à jour !");
      setStatus({ type: "success", msg: "Profil mis à jour avec succès !" });
    } catch (error) {
      setStatus({ type: "error", msg: "Erreur lors de la mise à jour." });
      toast.error("Echec de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-teal-600 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="font-medium">Chargement de votre univers NoBoutik...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-teal-700 hover:text-teal-900 transition mb-6 font-medium group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Retour au profil
      </button>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header NoBoutik */}
        <div className="bg-gradient-to-r from-teal-600 to-green-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full shadow-inner">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Paramètres du compte</h1>
              <p className="text-teal-50 text-sm opacity-90 italic">
                Optimisez votre présence sur NoBoutik
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Section : Informations Générales */}
          <div className="animate-in fade-in duration-500">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Informations Générales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  placeholder="Jean Dupont"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">
                  Email professionnel
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  placeholder="contact@noboutik.com"
                />
              </div>

              {/* Téléphone */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                  placeholder="+225 07..."
                />
              </div>

              {/* SELECT VILLES */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 ml-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-teal-600" /> Ville de
                  résidence
                </label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-gray-50/50 appearance-none cursor-pointer"
                >
                  <option value="">Sélectionnez votre ville</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section : Sécurité */}
          <div className="bg-teal-50/30 p-6 rounded-2xl space-y-4 border border-teal-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
              Sécurité du compte
            </h2>
            <div className="max-w-md">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
                placeholder="Laissez vide pour ne pas changer"
              />
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 animate-bounce-short ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <p className="text-sm font-bold mx-auto">{status.msg}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-extrabold transition-all transform active:scale-95 shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 hover:shadow-teal-200 hover:-translate-y-1"
              }`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Enregistrement..." : "Sauvegarder les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
