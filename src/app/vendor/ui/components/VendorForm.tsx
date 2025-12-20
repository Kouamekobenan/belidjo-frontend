"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Store, Globe, MapPin, Send, Loader2, FileText } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { ICity } from "@/app/city/domain/interface/city";
import { api } from "@/app/lib/api";
import { UserRepository } from "@/app/users/infrastructure/user-repository.impl";
import { UserMapper } from "@/app/users/domain/mappers/user.mapper";
import { UpdateRoleUserUseCase } from "@/app/users/application/usecases/update-role-user.usecase";
import { useRouter } from "next/navigation";

// Schéma de validation mis à jour avec la description
const vendorSchema = z.object({
  // id: z.string().uuid("ID utilisateur invalide"),
  userId: z.string().uuid("ID utilisateur invalide"),
  name: z
    .string()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(100),
  cityId: z.string().uuid("Veuillez sélectionner une ville").optional(),
  site: z
    .object({
      domain: z.string().min(3, "Le domaine est requis").optional(),
      description: z
        .string()
        .min(10, "La description doit faire au moins 10 caractères"),
    })
    .optional(),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

const userRepo = new UserRepository(new UserMapper());
const updateRoleUserUseCase = new UpdateRoleUserUseCase(userRepo);

// ... (tes imports et ton schéma restent identiques)

export default function CreateVendorForm() {
  const { user } = useAuth();
  const [city, setCity] = useState<ICity[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCity = async () => {
      try {
        setLoadingCities(true);
        const res = await api.get("/city");
        // Adaptation selon la structure habituelle de ton API (res.data.data)
        setCity(res.data.data || []);
      } catch (error) {
        console.error("Erreur villes:", error);
        toast.error("Impossible de charger les villes.");
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCity();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      userId: user?.id,
      site: { description: "" },
    },
  });
  const onSubmit = async (data: VendorFormValues) => {
    const loadingToast = toast.loading("Envoi de votre dossier...");
    try {
      if (!user?.id) {
        return;
      }
      Promise.all([
        await api.post("/vendor", data),
        await updateRoleUserUseCase.execute(user?.id),
      ]);
      toast.success("Demande envoyée ! Réponse sous 24h.", {
        id: loadingToast,
      });
      router.push("/admin/ui");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Échec de l'envoi.", {
        id: loadingToast,
      });
    }
  };
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 my-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white text-center">
        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <Store size={32} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          Espace Futur Vendeur
        </h2>
        <p className="text-teal-50 text-sm mt-2 font-medium">
          Parlez-nous de votre boutique NoBoutik
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 space-y-6 bg-white"
      >
        {/* Nom commercial */}
        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Store size={16} className="text-teal-600" /> Nom commercial
          </label>
          <input
            {...register("name")}
            placeholder="Nom de votre boutique"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.name
                ? "border-red-500 bg-red-50"
                : "border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            } outline-none transition-all`}
          />
          {errors.name && (
            <p className="text-red-500 text-[11px] mt-1 font-bold uppercase">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ville CORRIGÉ */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-teal-600" /> Ville
            </label>
            <select
              {...register("cityId")} // INDISPENSABLE pour que React Hook Form capte la valeur
              disabled={loadingCities}
              className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all appearance-none cursor-pointer ${
                errors.cityId
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              }`}
            >
              <option value="">
                {loadingCities ? "Chargement..." : "Sélectionnez une ville"}
              </option>
              {city.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.cityId && (
              <p className="text-red-500 text-[11px] mt-1 font-bold uppercase">
                {errors.cityId.message}
              </p>
            )}
          </div>
          {/* Domaine */}
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Globe size={16} className="text-teal-600" /> Domaine souhaité
            </label>
            <input
              {...register("site.domain")}
              placeholder="ex: ma-boutique"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition-all"
            />
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <FileText size={16} className="text-teal-600" /> Description de
            l'activité
          </label>
          <textarea
            {...register("site.description")}
            rows={4}
            placeholder="Décrivez vos produits..."
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.site?.description
                ? "border-red-500 bg-red-50"
                : "border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            } outline-none transition-all resize-none`}
          />
          {errors.site?.description && (
            <p className="text-red-500 text-[11px] mt-1 font-bold uppercase">
              {errors.site.description.message}
            </p>
          )}
        </div>
        {/* UserID caché */}
        <input type="hidden" {...register("userId")} />
        <button
          type="submit"
          disabled={isSubmitting || loadingCities}
          className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:-translate-y-1 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Send size={20} /> CRÉER MA BOUTIQUE
            </>
          )}
        </button>
      </form>
    </div>
  );
}
