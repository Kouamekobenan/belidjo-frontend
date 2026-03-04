"use client";
import { api } from "@/app/lib/api";
import React, { useEffect, useState } from "react";
import {
  Trash2,
  Edit,
  Plus,
  X,
  Save,
  MapPin,
  Search,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

interface CityType {
  id: string;
  name: string;
}

export default function ListCity() {
  const [cities, setCities] = useState<CityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentCity, setCurrentCity] = useState<CityType | null>(null);
  const [cityName, setCityName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/city");
      setCities(res.data.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des villes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setCityName("");
    setCurrentCity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (city: CityType) => {
    setModalMode("edit");
    setCurrentCity(city);
    setCityName(city.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!cityName.trim()) return;
    try {
      setIsSubmitting(true);
      if (modalMode === "create") {
        await api.post("/city", { name: cityName });
        toast.success("Ville créée avec succès");
      } else if (currentCity) {
        await api.patch(`/city/${currentCity.id}`, { name: cityName });
        toast.success("Ville modifiée avec succès");
      }
      await fetchCities();
      setIsModalOpen(false);
      setCityName("");
      setCurrentCity(null);
    } catch (err) {
      toast.error("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/city/${id}`);
      toast.success("Ville supprimée");
      await fetchCities();
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen pb-28" style={{ background: "#090d13" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              <MapPin className="w-5 h-5" style={{ color: "#06b6d4" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Villes de Côte d&apos;Ivoire
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {cities.length} ville{cities.length > 1 ? "s" : ""} répertoriée
                {cities.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={fetchCities}
              disabled={loading}
              className="w-10 h-10 inline-flex items-center justify-center rounded-xl transition-all border"
              style={{
                background: "rgba(255,255,255,0.03)",
                color: "#64748b",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border"
              style={{
                background: "rgba(6,182,212,0.1)",
                color: "#67e8f9",
                borderColor: "rgba(6,182,212,0.25)",
              }}
            >
              <Plus size={15} />
              Nouvelle ville
            </button>
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-600 rounded-xl outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(6,182,212,0.35)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.08)")
            }
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── LOADING ── */}
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#06b6d4", borderTopColor: "transparent" }}
            />
            <span className="text-sm text-slate-500">Chargement...</span>
          </div>
        ) : filteredCities.length === 0 ? (
          /* ── EMPTY ── */
          <div
            className="py-24 flex flex-col items-center gap-4 rounded-2xl border border-white/[0.05]"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <MapPin size={24} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {searchTerm ? "Aucune ville trouvée" : "Aucune ville enregistrée"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border mt-1 transition-all"
                style={{
                  background: "rgba(6,182,212,0.08)",
                  color: "#67e8f9",
                  borderColor: "rgba(6,182,212,0.2)",
                }}
              >
                <Plus size={14} /> Ajouter une ville
              </button>
            )}
          </div>
        ) : (
          /* ── GRID ── */
          <>
            {searchTerm && (
              <p className="text-xs text-slate-500">
                <span className="text-slate-300 font-semibold">
                  {filteredCities.length}
                </span>{" "}
                résultat{filteredCities.length > 1 ? "s" : ""} pour «{" "}
                {searchTerm} »
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="group rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(6,182,212,0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.06)")
                  }
                >
                  {/* City row */}
                  <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: "rgba(6,182,212,0.08)" }}
                    >
                      <MapPin size={15} style={{ color: "#06b6d4" }} />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                      {city.name}
                    </h3>
                  </div>

                  <div className="mx-4 border-t border-white/[0.04]" />

                  {/* Actions */}
                  <div className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(city)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border"
                      style={{
                        background: "rgba(16,185,129,0.08)",
                        color: "#6ee7b7",
                        borderColor: "rgba(16,185,129,0.15)",
                      }}
                    >
                      <Edit size={12} /> Modifier
                    </button>

                    {deleteConfirm === city.id ? (
                      <div className="flex-1 flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(city.id)}
                          className="flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border"
                          style={{
                            background: "rgba(239,68,68,0.12)",
                            color: "#f87171",
                            borderColor: "rgba(239,68,68,0.25)",
                          }}
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all border"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            color: "#64748b",
                            borderColor: "rgba(255,255,255,0.07)",
                          }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(city.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border"
                        style={{
                          background: "transparent",
                          color: "#f87171",
                          borderColor: "rgba(239,68,68,0.2)",
                        }}
                      >
                        <Trash2 size={12} /> Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* ── MODAL ── */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-2xl p-6 border border-white/[0.08]"
              style={{
                background: "#0d1117",
                boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(6,182,212,0.1)" }}
                  >
                    <MapPin size={15} style={{ color: "#06b6d4" }} />
                  </div>
                  <h2 className="text-base font-bold text-slate-100">
                    {modalMode === "create"
                      ? "Nouvelle ville"
                      : "Modifier la ville"}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#64748b",
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Input */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Nom de la ville
                </label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="Ex: Abidjan"
                  autoFocus
                  className="w-full px-4 py-3 text-sm text-slate-200 placeholder-slate-600 rounded-xl outline-none transition-all"
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
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border"
                  style={{
                    background: "transparent",
                    color: "#64748b",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!cityName.trim() || isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(6,182,212,0.1)",
                    color: "#67e8f9",
                    borderColor: "rgba(6,182,212,0.25)",
                  }}
                >
                  {isSubmitting ? (
                    <div
                      className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{
                        borderColor: "#67e8f9",
                        borderTopColor: "transparent",
                      }}
                    />
                  ) : (
                    <>
                      <Save size={14} />
                      {modalMode === "create" ? "Créer" : "Enregistrer"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
