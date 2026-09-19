"use client";

import React, { useState } from "react";
import { Clock, Truck, Save, Calendar, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export const VendorHoursSettings: React.FC = () => {
  const [hours, setHours] = useState({
    openingTime: "08:00",
    closingTime: "18:30",
    openDays: ["lun", "mar", "mer", "jeu", "ven", "sam"],
    prepTime: "30",
    deliveryInstructions: "Livraison disponible dans toute la ville de Bondoukou et sous 24h à Abidjan.",
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (day: string) => {
    setHours((prev) => {
      const exists = prev.openDays.includes(day);
      return {
        ...prev,
        openDays: exists ? prev.openDays.filter((d) => d !== day) : [...prev.openDays, day],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Horaires et conditions de livraison sauvegardés !");
    }, 800);
  };

  const daysList = [
    { key: "lun", label: "Lundi" },
    { key: "mar", label: "Mardi" },
    { key: "mer", label: "Mercredi" },
    { key: "jeu", label: "Jeudi" },
    { key: "ven", label: "Vendredi" },
    { key: "sam", label: "Samedi" },
    { key: "dim", label: "Dimanche" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Horaires & Conditions de Livraison</h3>
            <p className="text-xs text-slate-500">Définissez vos heures d'ouverture et vos délais de préparation</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
          <Truck className="w-3.5 h-3.5" /> Express
        </span>
      </div>

      {/* Jours d'ouverture */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Jours d'ouverture de la boutique
        </label>
        <div className="flex flex-wrap gap-2">
          {daysList.map((d) => {
            const isOpen = hours.openDays.includes(d.key);
            return (
              <button
                type="button"
                key={d.key}
                onClick={() => toggleDay(d.key)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isOpen
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plage horaire */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Heure d'ouverture
          </label>
          <input
            type="time"
            value={hours.openingTime}
            onChange={(e) => setHours({ ...hours, openingTime: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Heure de fermeture
          </label>
          <input
            type="time"
            value={hours.closingTime}
            onChange={(e) => setHours({ ...hours, closingTime: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Délai de préparation moyen
          </label>
          <select
            value={hours.prepTime}
            onChange={(e) => setHours({ ...hours, prepTime: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 cursor-pointer"
          >
            <option value="15">15 minutes (Express)</option>
            <option value="30">30 minutes (Standard)</option>
            <option value="60">1 heure</option>
            <option value="120">2 heures</option>
            <option value="1440">24 heures (Sur commande)</option>
          </select>
        </div>
      </div>

      {/* Consignes de livraison */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Consignes et Zones de livraison
        </label>
        <textarea
          rows={3}
          value={hours.deliveryInstructions}
          onChange={(e) => setHours({ ...hours, deliveryInstructions: e.target.value })}
          placeholder="Détaillez vos frais ou vos zones desservies..."
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600"
        />
      </div>

      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all"
        >
          {isSaving ? <span>Enregistrement...</span> : <><Save className="w-4 h-4" /><span>Sauvegarder les Horaires</span></>}
        </button>
      </div>
    </form>
  );
};

export default VendorHoursSettings;
