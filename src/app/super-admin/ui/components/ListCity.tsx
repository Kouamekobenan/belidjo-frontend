"use client";
import { api } from "@/app/lib/api";
import React, { useEffect, useState } from "react";
import { Trash2, Edit, Plus, X, Save, MapPin, Search } from "lucide-react";

interface CityType {
  id: string;
  name: string;
}

export default function ListCity() {
  const [cities, setCities] = useState<CityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour la modal de création/édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentCity, setCurrentCity] = useState<CityType | null>(null);
  const [cityName, setCityName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État pour la confirmation de suppression
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
      console.error(err);
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
      setCityName("");
      setCurrentCity(null);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Une erreur est survenue lors de la sauvegarde");
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
      console.error("Erreur lors de la suppression:", err);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-orange-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Villes de Côte d&apos;Ivoire
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {cities.length} ville{cities.length > 1 ? "s" : ""}{" "}
                  répertoriée{cities.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle ville</span>
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Liste des villes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-md">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "Aucune ville trouvée"
                  : "Aucune ville enregistrée"}
              </p>
            </div>
          ) : (
            filteredCities.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-gradient-to-br from-teal-100 to-green-100 rounded-lg group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg truncate">
                      {city.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(city)}
                    className="flex-1 flex items-center cursor-pointer justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200 font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Modifier</span>
                  </button>

                  {deleteConfirm === city.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="flex-1 px-3 py-2.5 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(city.id)}
                      className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Supprimer</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de création/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === "create"
                  ? "Nouvelle ville"
                  : "Modifier la ville"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la ville
                </label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="Ex: Abidjan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!cityName.trim() || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>
                        {modalMode === "create" ? "Créer" : "Enregistrer"}
                      </span>
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
