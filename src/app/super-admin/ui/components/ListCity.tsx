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
  Loader2,
} from "lucide-react";

interface CityType {
  id: string;
  name: string;
}

export default function ListCity() {
  const [cities, setCities] = useState<CityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      const res = await api.get("/city");
      setCities(res.data.data);
    } catch (err) {
      setError("Erreur lors du chargement des villes");
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
      } else if (currentCity) {
        await api.patch(`/city/${currentCity.id}`, { name: cityName });
      }
      await fetchCities();
      setIsModalOpen(false);
    } catch (err) {
      alert("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/city/${id}`);
      await fetchCities();
      setDeleteConfirm(null);
    } catch (err) {
      alert("Erreur de suppression");
    }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-zinc-400 font-medium animate-pulse">
          Initialisation du tableau de bord...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-emerald-500 font-semibold tracking-wider text-xs uppercase">
                Administration
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Gestion des Villes
            </h1>
            <p className="text-zinc-500 mt-1">
              Gérez le répertoire géographique de la plateforme.
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all duration-200 font-medium shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter une ville</span>
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-3 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une ville par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#121214] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-zinc-200 placeholder:text-zinc-600"
            />
          </div>
          <div className="bg-[#121214] border border-zinc-800 rounded-xl flex items-center justify-center p-3">
            <span className="text-zinc-400 text-sm">
              Total : <b className="text-white ml-1">{cities.length}</b>
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
            <X className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCities.length === 0 ? (
            <div className="col-span-full py-20 bg-[#121214] border border-dashed border-zinc-800 rounded-2xl text-center">
              <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">
                Aucun résultat trouvé pour votre recherche.
              </p>
            </div>
          ) : (
            filteredCities.map((city) => (
              <div
                key={city.id}
                className="group bg-[#121214] border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/30 hover:bg-[#18181b] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all">
                      <MapPin className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-100 group-hover:text-white">
                      {city.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(city)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" /> Modifier
                  </button>

                  {deleteConfirm === city.id ? (
                    <div className="flex-[1.5] flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(city.id)}
                      className="p-2 bg-zinc-800/50 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modern Dark Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-[#121214] border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {modalMode === "create" ? "Ajouter une ville" : "Mettre à jour"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Nom de la ville
                </label>
                <input
                  autoFocus
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="ex: Yamoussoukro"
                  className="w-full px-4 py-3 bg-[#09090b] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!cityName.trim() || isSubmitting}
                  className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> Confirmer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
