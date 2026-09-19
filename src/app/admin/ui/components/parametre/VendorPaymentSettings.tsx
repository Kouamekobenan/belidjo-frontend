"use client";

import React, { useState } from "react";
import { CreditCard, Save, CheckCircle2, ShieldCheck, PhoneCall } from "lucide-react";
import toast from "react-hot-toast";

export const VendorPaymentSettings: React.FC = () => {
  const [payments, setPayments] = useState({
    waveNumber: "+225 07 00 11 22 33",
    orangeNumber: "+225 08 44 55 66 77",
    mtnNumber: "+225 05 99 88 77 66",
    moovNumber: "",
    acceptCashOnDelivery: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPayments((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Comptes de paiement Mobile Money sauvegardés !");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Comptes de Règlement Mobile Money</h3>
            <p className="text-xs text-slate-500">Configurez vos numéros pour recevoir les paiements direct client</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700">
          <ShieldCheck className="w-3.5 h-3.5" /> Sécurisé SSL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Wave Mobile Money */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Wave Mobile Money
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-white">Recommandé</span>
          </div>
          <input
            type="text"
            name="waveNumber"
            value={payments.waveNumber}
            onChange={handleChange}
            placeholder="+225 07 xx xx xx xx"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Orange Money */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Orange Money
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white">CI</span>
          </div>
          <input
            type="text"
            name="orangeNumber"
            value={payments.orangeNumber}
            onChange={handleChange}
            placeholder="+225 07 xx xx xx xx"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* MTN MoMo */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> MTN Mobile Money
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400 text-slate-900">MoMo</span>
          </div>
          <input
            type="text"
            name="mtnNumber"
            value={payments.mtnNumber}
            onChange={handleChange}
            placeholder="+225 05 xx xx xx xx"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-yellow-500"
          />
        </div>

        {/* Moov Money */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Moov Money
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">Moov</span>
          </div>
          <input
            type="text"
            name="moovNumber"
            value={payments.moovNumber}
            onChange={handleChange}
            placeholder="+225 01 xx xx xx xx"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Option Cash à la livraison */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Paiement en espèces à la livraison</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Permettre aux clients de régler le coursier lors de la réception</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="acceptCashOnDelivery"
            checked={payments.acceptCashOnDelivery}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition-all"
        >
          {isSaving ? <span>Enregistrement...</span> : <><Save className="w-4 h-4" /><span>Sauvegarder les Comptes</span></>}
        </button>
      </div>
    </form>
  );
};

export default VendorPaymentSettings;
