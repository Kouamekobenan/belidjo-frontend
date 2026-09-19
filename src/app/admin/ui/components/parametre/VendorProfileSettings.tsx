"use client";

import React, { useState } from "react";
import { Store, MapPin, Phone, Mail, FileText, Check, Save, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileSettingsProps {
  initialData?: {
    name?: string;
    tagline?: string;
    description?: string;
    phone?: string;
    cityName?: string;
    email?: string;
  };
}

export const VendorProfileSettings: React.FC<ProfileSettingsProps> = ({ initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    tagline: initialData?.tagline || "Votre boutique de confiance",
    description: initialData?.description || "",
    phone: initialData?.phone || "",
    cityName: initialData?.cityName || "Bondoukou",
    email: initialData?.email || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profil de votre boutique mis à jour avec succès !");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Identité & Profil Boutique</h3>
            <p className="text-xs text-slate-500">Informations visibles par les clients sur NoBoutik</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
          <Sparkles className="w-3.5 h-3.5" /> Boutique Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Nom commercial */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Nom Commercial de la Boutique <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Boutique Elegance Bondoukou"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
            />
            <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Slogan */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Slogan ou Accroche
          </label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="Ex: Le meilleur de la mode locale"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Description de la Boutique
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Présentez l'histoire de votre commerce, vos produits phares et votre engagement qualité..."
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        {/* Ville / Localisation */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Ville / Commune <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="cityName"
              value={formData.cityName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="Bondoukou">Bondoukou (Zanzan)</option>
              <option value="Abidjan - Cocody">Abidjan - Cocody</option>
              <option value="Abidjan - Yopougon">Abidjan - Yopougon</option>
              <option value="Abidjan - Marcory">Abidjan - Marcory</option>
              <option value="Abidjan - Plateau">Abidjan - Plateau</option>
              <option value="Bouaké">Bouaké</option>
              <option value="Yamoussoukro">Yamoussoukro</option>
              <option value="San-Pédro">San-Pédro</option>
            </select>
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Téléphone WhatsApp */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Téléphone WhatsApp Pro <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+225 07 00 00 00"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Email de Contact
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@maboutique.ci"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white transition-all"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all"
        >
          {isSaving ? (
            <span>Enregistrement...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Enregistrer le Profil</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default VendorProfileSettings;
