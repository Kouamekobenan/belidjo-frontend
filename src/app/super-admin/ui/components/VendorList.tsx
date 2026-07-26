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
  MapPin,
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

export default function VendorList() {
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
    } catch {
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
    } catch {
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
    } catch {
      toast.error("Erreur lors de la modification", { id: loadingToast });
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.site?.domain?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total,
    approved: vendors.filter((v) => v.isApproved).length,
    featured: vendors.filter((v) => v.isFeatured).length,
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#090d13" }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-28 space-y-5 w-full box-border">
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight truncate">
              Boutiques partenaires
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gérez vos boutiques partenaires et leurs accès.
            </p>
          </div>
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 rounded-xl outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(6,182,212,0.4)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.08)")
              }
            />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            {
              icon: Users,
              label: "Total",
              labelFull: "Total Partenaires",
              value: stats.total,
              color: "#06b6d4",
              bg: "rgba(6,182,212,0.08)",
            },
            {
              icon: CheckCircle,
              label: "Actives",
              labelFull: "Boutiques Actives",
              value: stats.approved,
              color: "#10b981",
              bg: "rgba(16,185,129,0.08)",
            },
            {
              icon: Star,
              label: "Vedette",
              labelFull: "En Vedette",
              value: stats.featured,
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.08)",
            },
          ].map(({ icon: Icon, label, labelFull, value, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.06] transition-all duration-200 p-3 sm:p-5"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bg }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-widest truncate">
                    <span className="sm:hidden">{label}</span>
                    <span className="hidden sm:inline">{labelFull}</span>
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-100 mt-0.5 leading-none">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div
          className="hidden md:block rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ background: "rgba(255,255,255,0.025)" }}
        >
          <div
            className="px-6 py-4 flex justify-between items-center border-b border-white/[0.05]"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              Liste des boutiques
              {searchQuery && (
                <span className="text-xs text-slate-500 font-normal">
                  — {filteredVendors.length} résultat
                  {filteredVendors.length > 1 ? "s" : ""}
                </span>
              )}
            </h3>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(6,182,212,0.1)",
                color: "#06b6d4",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              {filteredVendors.length} affichés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-[11px] text-slate-600 uppercase tracking-widest font-semibold border-b border-white/[0.04]"
                  style={{ background: "rgba(255,255,255,0.01)" }}
                >
                  <th className="px-6 py-3.5">Boutique / Site</th>
                  <th className="px-6 py-3.5">Propriétaire</th>
                  <th className="px-6 py-3.5 text-center">Statuts</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                          style={{
                            borderColor: "#06b6d4",
                            borderTopColor: "transparent",
                          }}
                        />
                        <span className="text-sm text-slate-500">
                          Chargement des données...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVendors.length > 0 ? (
                  filteredVendors.map((v, i) => (
                    <tr
                      key={v.id}
                      className="border-b border-white/[0.03] transition-colors group"
                      style={{
                        background:
                          i % 2 === 0
                            ? "transparent"
                            : "rgba(255,255,255,0.01)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(6,182,212,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          i % 2 === 0
                            ? "transparent"
                            : "rgba(255,255,255,0.01)")
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {v.isFeatured && (
                            <Star
                              size={14}
                              className="text-amber-400 fill-amber-400 flex-shrink-0"
                            />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                              {v.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                              <Globe size={11} />
                              <span className="truncate max-w-xs">
                                {v.site?.domain || "Pas de domaine"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-300">
                          {v.user?.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Phone size={10} />
                            {v.user?.phone}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                            style={{
                              background: "rgba(16,185,129,0.1)",
                              color: "#6ee7b7",
                              border: "1px solid rgba(16,185,129,0.15)",
                            }}
                          >
                            {v.city.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-2">
                          {v.isApproved ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
                              style={{
                                background: "rgba(16,185,129,0.1)",
                                color: "#6ee7b7",
                                border: "1px solid rgba(16,185,129,0.2)",
                              }}
                            >
                              <CheckCircle size={11} /> Actif
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
                              style={{
                                background: "rgba(245,158,11,0.1)",
                                color: "#fcd34d",
                                border: "1px solid rgba(245,158,11,0.2)",
                              }}
                            >
                              <XCircle size={11} /> Attente
                            </span>
                          )}
                          {v.isFeatured && (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
                              style={{
                                background: "rgba(245,158,11,0.1)",
                                color: "#fbbf24",
                                border: "1px solid rgba(245,158,11,0.2)",
                              }}
                            >
                              <Star size={11} className="fill-current" /> Vedette
                            </span>
                          )}
                          <VendorVisitModal
                            vendorId={v.id}
                            vendorName={v.name}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <PreviewBadgeModal vendor={v} />
                          <button
                            onClick={() =>
                              handleToggleFeatureStatus(v.id, v.isFeatured)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border"
                            style={
                              v.isFeatured
                                ? {
                                    background: "transparent",
                                    color: "#fbbf24",
                                    borderColor: "rgba(245,158,11,0.3)",
                                  }
                                : {
                                    background: "rgba(245,158,11,0.1)",
                                    color: "#fbbf24",
                                    borderColor: "rgba(245,158,11,0.25)",
                                  }
                            }
                          >
                            {v.isFeatured ? (
                              <>
                                <StarOff size={13} /> Retirer
                              </>
                            ) : (
                              <>
                                <Star size={13} /> Vedette
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(v.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border"
                            style={
                              v.isApproved
                                ? {
                                    background: "transparent",
                                    color: "#f87171",
                                    borderColor: "rgba(239,68,68,0.3)",
                                  }
                                : {
                                    background: "rgba(6,182,212,0.1)",
                                    color: "#67e8f9",
                                    borderColor: "rgba(6,182,212,0.25)",
                                  }
                            }
                          >
                            <ShieldCheck size={13} />
                            {v.isApproved ? "Révoquer" : "Approuver"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                        >
                          <Search size={22} className="text-slate-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">
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

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Liste des boutiques
              {searchQuery && (
                <span className="text-slate-600 font-normal ml-1.5">
                  ({filteredVendors.length})
                </span>
              )}
            </h3>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg flex-shrink-0"
              style={{
                background: "rgba(6,182,212,0.1)",
                color: "#06b6d4",
                border: "1px solid rgba(6,182,212,0.15)",
              }}
            >
              {filteredVendors.length}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
                  style={{
                    borderColor: "#06b6d4",
                    borderTopColor: "transparent",
                  }}
                />
                <span className="text-xs text-slate-500">Chargement...</span>
              </div>
            </div>
          ) : filteredVendors.length > 0 ? (
            <div className="space-y-3">
              {filteredVendors.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl overflow-hidden border border-white/[0.06] w-full"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  <div className="px-3 pt-4 pb-3 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {v.isFeatured && (
                        <Star
                          size={13}
                          className="text-amber-400 fill-amber-400 flex-shrink-0 mt-0.5"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate">
                          {v.name}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5 min-w-0">
                          <Globe size={10} className="flex-shrink-0" />
                          <span className="truncate">
                            {v.site?.domain || "Pas de domaine"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0 items-end">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide whitespace-nowrap"
                        style={
                          v.isApproved
                            ? {
                                background: "rgba(16,185,129,0.1)",
                                color: "#6ee7b7",
                                border: "1px solid rgba(16,185,129,0.2)",
                              }
                            : {
                                background: "rgba(245,158,11,0.1)",
                                color: "#fcd34d",
                                border: "1px solid rgba(245,158,11,0.2)",
                              }
                        }
                      >
                        {v.isApproved ? (
                          <CheckCircle size={9} />
                        ) : (
                          <XCircle size={9} />
                        )}
                        {v.isApproved ? "Actif" : "Attente"}
                      </span>
                      {v.isFeatured && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide whitespace-nowrap"
                          style={{
                            background: "rgba(245,158,11,0.1)",
                            color: "#fbbf24",
                            border: "1px solid rgba(245,158,11,0.2)",
                          }}
                        >
                          <Star size={9} className="fill-current" /> Vedette
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mx-3 border-t border-white/[0.04]" />

                  <div className="px-3 py-3">
                    <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-300 truncate">
                          {v.user?.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                          <Phone size={10} className="flex-shrink-0" />
                          <span className="truncate">{v.user?.phone}</span>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
                        style={{
                          background: "rgba(16,185,129,0.08)",
                          color: "#6ee7b7",
                          border: "1px solid rgba(16,185,129,0.15)",
                        }}
                      >
                        <MapPin size={9} /> {v.city.name}
                      </span>
                    </div>
                  </div>

                  <div className="mx-3 border-t border-white/[0.04]" />

                  <div className="px-3 py-3 space-y-2">
                    <VendorVisitModal vendorId={v.id} vendorName={v.name} />
                    <div className="grid grid-cols-2 gap-2">
                      <PreviewBadgeModal vendor={v} />
                      <button
                        onClick={() =>
                          handleToggleFeatureStatus(v.id, v.isFeatured)
                        }
                        className="inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[11px] font-semibold transition-all border active:scale-95 whitespace-nowrap overflow-hidden"
                        style={
                          v.isFeatured
                            ? {
                                background: "transparent",
                                color: "#fbbf24",
                                borderColor: "rgba(245,158,11,0.3)",
                              }
                            : {
                                background: "rgba(245,158,11,0.08)",
                                color: "#fbbf24",
                                borderColor: "rgba(245,158,11,0.2)",
                              }
                        }
                      >
                        {v.isFeatured ? (
                          <>
                            <StarOff size={12} className="flex-shrink-0" />{" "}
                            Retirer
                          </>
                        ) : (
                          <>
                            <Star size={12} className="flex-shrink-0" /> Vedette
                          </>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(v.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all border active:scale-95"
                      style={
                        v.isApproved
                          ? {
                              background: "transparent",
                              color: "#f87171",
                              borderColor: "rgba(239,68,68,0.25)",
                            }
                          : {
                              background: "rgba(6,182,212,0.08)",
                              color: "#67e8f9",
                              borderColor: "rgba(6,182,212,0.2)",
                            }
                      }
                    >
                      <ShieldCheck size={12} className="flex-shrink-0" />
                      {v.isApproved
                        ? "Révoquer l'accès"
                        : "Approuver la boutique"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Search size={24} className="text-slate-600" />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {searchQuery
                    ? "Aucun résultat pour votre recherche"
                    : "Aucun partenaire trouvé"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
