"use client";
import { useAuth } from "@/app/context/AuthContext";
import { GetProductsByVendorUseCase } from "@/app/products/application/usecases/get-product.usecase";
import { IProduct } from "@/app/products/domain/entities/product.entity";
import { ProductRepository } from "@/app/products/infrastructure/product-repository";
import React, { useEffect, useState, useMemo } from "react";
import {
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Eye,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ProductMapper } from "@/app/products/domain/mappers/product.mapper";

const repo = new ProductRepository(new ProductMapper());
const getProducts = new GetProductsByVendorUseCase(repo);

interface StatsCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: string;
  bgColor: string;
}

export default function DashbordVendor() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const vendorId = user?.vendorProfile?.id;

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (!vendorId) {
      setLoading(false);
      return;
    }
    getProducts
      .execute(vendorId, 10, pagination.page)
      .then((res) => {
        const mappedProducts: IProduct[] = res.data.map((product: any) => ({
          ...product,
        }));
        setProducts(mappedProducts);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des produits:", err);
        setError("Échec du chargement des produits. Veuillez réessayer.");
        setLoading(false);
      });
  }, [vendorId, pagination.page]);

  // Calculs des statistiques
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStock = products.filter((p) => p.quantity < 5).length;
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    return {
      totalProducts,
      totalValue,
      totalStock,
      lowStock,
      averagePrice,
    };
  }, [products]);

  // Données pour le graphique de tendance (7 derniers jours simulés)
  const trendData = useMemo(() => {
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    return days.map((day, index) => ({
      name: day,
      ventes: Math.floor(Math.random() * 50) + 10,
      vues: Math.floor(Math.random() * 100) + 50,
    }));
  }, []);

  // Données pour le graphique de stock par catégorie
  const stockByCategory = useMemo(() => {
    const categories: { [key: string]: number } = {};
    products.forEach((product) => {
      const cat = product.categoryId || "Non catégorisé";
      categories[cat] = (categories[cat] || 0) + product.quantity;
    });

    return Object.entries(categories).map(([name, stock]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      stock,
    }));
  }, [products]);

  // Données des cartes statistiques
  const statsCards: StatsCard[] = [
    {
      title: "Total Produits",
      value: stats.totalProducts,
      icon: Package,
      trend: "+12% ce mois",
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Valeur du Stock en fcfa",
      value: `${stats.totalValue.toLocaleString()} `,
      icon: DollarSign,
      trend: "+8% ce mois",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Stock Total",
      value: stats.totalStock,
      icon: ShoppingCart,
      trend: "Unités disponibles",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Stock Faible",
      value: stats.lowStock,
      icon: AlertCircle,
      trend: "Nécessite attention",
      trendUp: false,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-l-4 border-red-500">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600">
            Impossible de récupérer les données. Veuillez vous connecter.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">
            Chargement du tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-l-4 border-red-500">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                Tableau de bord
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">Bienvenue,</p>
              <p className="text-lg font-bold text-teal-600">
                {user?.name || "Vendeur"}
              </p>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-l-4 border-transparent hover:border-teal-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                {card.trend && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      card.trendUp
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {card.trendUp && (
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                    )}
                    {card.trend}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique de tendance des ventes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-teal-600" />
                Tendance des Ventes
              </h2>
              <span className="text-sm text-gray-500">7 derniers jours</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="ventes"
                  stroke="#14b8a6"
                  fillOpacity={1}
                  fill="url(#colorVentes)"
                  name="Ventes"
                />
                <Area
                  type="monotone"
                  dataKey="vues"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorVues)"
                  name="Vues"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique de stock par catégorie */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-teal-600" />
                Stock par Catégorie
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="stock"
                  fill="#14b8a6"
                  radius={[8, 8, 0, 0]}
                  name="Unités en stock"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produits récents */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6 text-teal-600" />
            Produits Récents
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Produit
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Prix
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {product.price.toLocaleString()} FCFA
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.quantity < 5
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.quantity} unités
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibo`}
                      >
                        {product ? "Disponible" : "Indisponible"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
