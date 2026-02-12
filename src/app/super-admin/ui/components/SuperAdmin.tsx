"use client";
import { Vendor } from "@/app/vendor/domain/entities/vendor.entity";
import { VendorRepository } from "@/app/vendor/infrastructure/api/vendor.api";
import React, { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Globe,
  Phone,
  ShieldCheck,
  Search,
  Star,
  StarOff,
} from "lucide-react";
import { ApproveVendorUseCase } from "@/app/vendor/application/usecases/approve-vendor.usecase";
import toast from "react-hot-toast";
import { GetAllVendorUseCase } from "@/app/vendor/application/usecases/getAll-vendor.usecase";
import { UpdateFeatureStatusUsecase } from "@/app/vendor/application/usecases/update-feature-status.usecase";
import VendorVisitModal from "./VendorVisitModal";
import PreviewBadgeModal from "./PreviewBadgeModal";

const repoVendor = new VendorRepository();
const findAllVendorUseCase = new GetAllVendorUseCase(repoVendor);
const approveVendorUseCase = new ApproveVendorUseCase(repoVendor);
const updateFeatureStatusUseCase = new UpdateFeatureStatusUsecase(repoVendor);

export default function SuperAdmin() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleToggleFeatureStatus = async (
    vendorId: string,
    currentStatus: boolean,
  ) => {
    const loadingToast = toast.loading(
      currentStatus ? "Retrait de la vedette..." : "Mise en vedette...",
    );
    try {
      if (!vendorId) throw new Error("ID manquant");
      await updateFeatureStatusUseCase.execute(vendorId, !currentStatus);
      toast.success(
        currentStatus ? "Retiré de la vedette !" : "Mis en vedette !",
        { id: loadingToast },
      );
      await fetchVendors();
    } catch (error) {
      toast.error("Erreur lors de la modification", { id: loadingToast });
    }
  };
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

  // Filtrage des vendeurs
  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.site?.domain?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Statistiques
  const stats = {
    total: total,
    approved: vendors.filter((v) => v.isApproved).length,
    featured: vendors.filter((v) => v.isFeatured).length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 pb-24 space-y-4 md:space-y-6">
        {/* HEADER DE LA PAGE */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Tableau de bord
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-1">
              Gérez vos boutiques partenaires et leurs accès.
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="relative w-full">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-full transition-all shadow-sm"
            />
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 rounded-xl md:rounded-2xl flex-shrink-0">
                <Users size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                  Total Partenaires
                </p>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mt-0.5 md:mt-1">
                  {stats.total}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-xl md:rounded-2xl flex-shrink-0">
                <CheckCircle size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                  Boutiques Actives
                </p>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mt-0.5 md:mt-1">
                  {stats.approved}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-gradient-to-br from-yellow-50 to-amber-100 text-amber-600 rounded-xl md:rounded-2xl flex-shrink-0">
                <Star size={20} className="md:w-6 md:h-6 fill-current" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                  En Vedette
                </p>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mt-0.5 md:mt-1">
                  {stats.featured}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP: TABLE VIEW */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span>Liste des boutiques</span>
              {searchQuery && (
                <span className="text-xs text-slate-500 font-normal">
                  ({filteredVendors.length} résultat
                  {filteredVendors.length > 1 ? "s" : ""})
                </span>
              )}
            </h3>
            <span className="text-[10px] bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wide">
              {filteredVendors.length} affichés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4">Boutique / Site</th>
                  <th className="px-6 py-4">Propriétaire</th>
                  <th className="px-6 py-4 text-center">Statuts</th>
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
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium">
                          Chargement des données...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVendors.length > 0 ? (
                  filteredVendors.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {v.isFeatured && (
                            <Star
                              size={16}
                              className="text-amber-500 fill-amber-500 flex-shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                              {v.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <Globe size={12} />
                              <span className="truncate max-w-xs">
                                {v.site?.domain || "Pas de domaine"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-800">
                          {v.user?.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Phone size={11} />
                            {v.user?.phone}
                          </span>
                          <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-0.5 rounded-md font-medium">
                            {v.city.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-2">
                          {/* Statut d'approbation */}
                          {v.isApproved ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                              <CheckCircle size={13} />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                              <XCircle size={13} />
                              Attente
                            </span>
                          )}

                          {/* Statut vedette */}
                          {v.isFeatured && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                              <Star size={13} className="fill-current" />
                              Vedette
                            </span>
                          )}
                          {/* Modal des statistiques */}
                          <VendorVisitModal
                            vendorId={v.id}
                            vendorName={v.name}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <PreviewBadgeModal vendor={v} />
                          {/* Bouton Vedette */}
                          <button
                            onClick={() =>
                              handleToggleFeatureStatus(v.id, v.isFeatured)
                            }
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm hover:shadow-md ${
                              v.isFeatured
                                ? "text-amber-700 bg-white border-amber-200 hover:bg-amber-50"
                                : "text-white bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-500 hover:from-amber-600 hover:to-yellow-600"
                            }`}
                            title={
                              v.isFeatured
                                ? "Retirer de la vedette"
                                : "Mettre en vedette"
                            }
                          >
                            {v.isFeatured ? (
                              <>
                                <StarOff size={14} />
                                Retirer
                              </>
                            ) : (
                              <>
                                <Star size={14} />
                                Mettre en vedette
                              </>
                            )}
                          </button>

                          {/* Bouton Approbation */}
                          <button
                            onClick={() => handleToggleStatus(v.id)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm hover:shadow-md ${
                              v.isApproved
                                ? "text-red-600 bg-white border-red-200 hover:bg-red-50"
                                : "text-white bg-gradient-to-r from-teal-600 to-teal-500 border-teal-600 hover:from-teal-700 hover:to-teal-600"
                            }`}
                          >
                            <ShieldCheck size={14} />
                            {v.isApproved ? "Révoquer" : "Approuver"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-20 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search size={40} className="text-slate-300" />
                        <p className="font-medium">
                          {searchQuery
                            ? "Aucun résultat pour votre recherche"
                            : "Aucun partenaire trouvé"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE: CARD VIEW */}
        <div className="md:hidden space-y-3">
          <div className="flex justify-between items-center px-0.5">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <span>Liste des boutiques</span>
              {searchQuery && (
                <span className="text-[10px] sm:text-xs text-slate-500 font-normal">
                  ({filteredVendors.length})
                </span>
              )}
            </h3>
            <span className="text-[9px] sm:text-[10px] bg-teal-100 text-teal-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-bold uppercase">
              {filteredVendors.length}
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-7 h-7 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium text-xs">Chargement...</span>
              </div>
            </div>
          ) : filteredVendors.length > 0 ? (
            <div className="space-y-2.5">
              {filteredVendors.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 space-y-2.5 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 flex items-start gap-1.5">
                      {v.isFeatured && (
                        <Star
                          size={14}
                          className="text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {v.name}
                        </h4>
                        <PreviewBadgeModal vendor={v} />
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                          <Globe size={10} className="flex-shrink-0" />
                          <span className="truncate">
                            {v.site?.domain || "Pas de domaine"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {/* Statut d'approbation */}
                      {v.isApproved ? (
                        <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[9px] font-bold bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 uppercase whitespace-nowrap">
                          <CheckCircle size={9} className="sm:w-2.5 sm:h-2.5" />{" "}
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[9px] font-bold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 uppercase whitespace-nowrap">
                          <XCircle size={9} className="sm:w-2.5 sm:h-2.5" />{" "}
                          Attente
                        </span>
                      )}

                      {/* Statut vedette */}
                      {v.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[9px] font-bold bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-700 border border-amber-200 uppercase whitespace-nowrap">
                          <Star
                            size={9}
                            className="fill-current sm:w-2.5 sm:h-2.5"
                          />{" "}
                          Vedette
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="bg-slate-50 rounded-lg p-2.5 space-y-1">
                    <div className="text-[11px] sm:text-xs font-medium text-slate-800 truncate">
                      {v.user?.name}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <Phone
                          size={9}
                          className="sm:w-2.5 sm:h-2.5 flex-shrink-0"
                        />
                        <span className="truncate max-w-[120px]">
                          {v.user?.phone}
                        </span>
                      </span>
                      <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded font-medium truncate max-w-[100px]">
                        {v.city.name}
                      </span>
                    </div>
                  </div>

                  {/* Bouton Statistiques */}
                  <div className="pt-1">
                    <VendorVisitModal vendorId={v.id} vendorName={v.name} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    {/* Bouton Vedette */}
                    <button
                      onClick={() =>
                        handleToggleFeatureStatus(v.id, v.isFeatured)
                      }
                      className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all border shadow-sm active:scale-95 ${
                        v.isFeatured
                          ? "text-amber-700 bg-white border-amber-200 active:bg-amber-50"
                          : "text-white bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-500 active:from-amber-600 active:to-yellow-600"
                      }`}
                    >
                      {v.isFeatured ? (
                        <>
                          <StarOff
                            size={12}
                            className="sm:w-3.5 sm:h-3.5 flex-shrink-0"
                          />
                          <span className="truncate">Retirer vedette</span>
                        </>
                      ) : (
                        <>
                          <Star
                            size={12}
                            className="sm:w-3.5 sm:h-3.5 flex-shrink-0"
                          />
                          <span className="truncate">Mettre en vedette</span>
                        </>
                      )}
                    </button>

                    {/* Bouton Approbation */}
                    <button
                      onClick={() => handleToggleStatus(v.id)}
                      className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all border shadow-sm active:scale-95 ${
                        v.isApproved
                          ? "text-red-600 bg-white border-red-200 active:bg-red-50"
                          : "text-white bg-gradient-to-r from-teal-600 to-teal-500 border-teal-600 active:from-teal-700 active:to-teal-600"
                      }`}
                    >
                      <ShieldCheck
                        size={12}
                        className="sm:w-3.5 sm:h-3.5 flex-shrink-0"
                      />
                      <span className="truncate">
                        {v.isApproved ? "Révoquer" : "Approuver"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <Search size={32} className="text-slate-300" />
                <p className="font-medium text-xs sm:text-sm">
                  {searchQuery ? "Aucun résultat" : "Aucun partenaire"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
