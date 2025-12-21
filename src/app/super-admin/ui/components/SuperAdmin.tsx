"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Vendor } from "@/app/vendor/domain/entities/vendor.entity";
import { VendorRepository } from "@/app/vendor/infrastructure/api/vendor.api";
import React, { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  Search,
} from "lucide-react";
import { ApproveVendorUseCase } from "@/app/vendor/application/usecases/approve-vendor.usecase";
import toast from "react-hot-toast";
import { GetAllVendorUseCase } from "@/app/vendor/application/usecases/getAll-vendor.usecase";

const repoVendor = new VendorRepository();
const findAllVendorUseCase = new GetAllVendorUseCase(repoVendor);
const approveVendorUseCase = new ApproveVendorUseCase(repoVendor);

export default function SuperAdmin() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const VENDOR_PER_PAGE = 50;

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await findAllVendorUseCase.execute(VENDOR_PER_PAGE, 1);
      setVendors(res.data);
      setTotal(res.total);
    } catch (error) {
      toast.error("Impossible de charger les partenaires");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleToggleStatus = async (vendorId: string) => {
    const loadingToast = toast.loading("Mise à jour du statut...");
    try {
      if (!vendorId) throw new Error("ID manquant");
      await approveVendorUseCase.execute(vendorId);
      toast.success("Statut mis à jour !", { id: loadingToast });
      await fetchVendors();
    } catch (error) {
      toast.error("Erreur lors de la modification", { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Tableau de bord
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Gérez vos boutiques partenaires et leurs accès.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une boutique..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none w-full transition-all"
          />
        </div>
      </div>
      {/* STATS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 md:gap-5">
          <div className="p-3 md:p-4 bg-teal-50 text-teal-600 rounded-2xl">
            <Users size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Partenaires
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {total}
            </h2>
          </div>
        </div>
      </div>
      {/* DESKTOP: TABLE VIEW */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-bold text-slate-700">Liste des boutiques</h3>
          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-md font-bold uppercase">
            {vendors.length} affichés
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-50">
                <th className="px-6 py-4">Boutique / Site</th>
                <th className="px-6 py-4">Propriétaire</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center text-slate-400 text-sm"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      Chargement des données...
                    </div>
                  </td>
                </tr>
              ) : vendors.length > 0 ? (
                vendors.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                        {v.name}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Globe size={12} /> {v.site?.domain || "Pas de domaine"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">
                        {v.user?.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <Phone size={10} /> {v.user?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {v.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                          <CheckCircle size={12} /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase">
                          <XCircle size={12} /> Attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(v.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          v.isApproved
                            ? "text-red-500 bg-white border-red-100 hover:bg-red-50"
                            : "text-white bg-teal-600 border-teal-600 hover:bg-teal-700 shadow-md shadow-teal-100"
                        }`}
                      >
                        <ShieldCheck size={14} />
                        {v.isApproved ? "Révoquer" : "Approuver"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center text-slate-400 italic"
                  >
                    Aucun partenaire trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* MOBILE: CARD VIEW */}
      <div className="md:hidden space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-700 text-sm">
            Liste des boutiques
          </h3>
          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-md font-bold uppercase">
            {vendors.length} affichés
          </span>
        </div>
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              Chargement des données...
            </div>
          </div>
        ) : vendors.length > 0 ? (
          <div className="space-y-3">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">
                      {v.name}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Globe size={11} />
                      <span className="truncate">
                        {v.site?.domain || "Pas de domaine"}
                      </span>
                    </div>
                  </div>
                  {v.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase whitespace-nowrap">
                      <CheckCircle size={10} /> Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase whitespace-nowrap">
                      <XCircle size={10} /> Attente
                    </span>
                  )}
                </div>
                {/* Owner Info */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-1.5">
                  <div className="text-xs font-medium text-slate-700">
                    {v.user?.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Phone size={10} />
                    <span>{v.user?.phone}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleToggleStatus(v.id)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    v.isApproved
                      ? "text-red-500 bg-white border-red-100 active:bg-red-50"
                      : "text-white bg-teal-600 border-teal-600 active:bg-teal-700 shadow-md shadow-teal-100"
                  }`}
                >
                  <ShieldCheck size={14} />
                  {v.isApproved ? "Révoquer" : "Approuver"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 italic text-sm">
            Aucun partenaire trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
