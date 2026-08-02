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
  LayoutDashboard,
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
import DashBordVisitAdmin from "@/app/visit/views/VisitDahBoard";

const repo = new ProductRepository(new ProductMapper());
const getProducts = new GetProductsByVendorUseCase(repo);

export default function DashbordVendor() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const vendorId = user?.vendorProfile?.id;
  useEffect(() => {
    if (!vendorId) return;
    setLoading(true);
    getProducts
      .execute(vendorId, 10, pagination.page)
      .then((res) => {
        setProducts(res.data);
        setPagination({ page: res.page, totalPages: res.totalPages });
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setError("Échec du chargement des produits.");
      })
      .finally(() => setLoading(false));
  }, [vendorId, pagination.page]);

  // Calculs des statistiques produits
  const stats = useMemo(() => {
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0,
    );
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStock = products.filter((p) => p.quantity < 5).length;
    return { totalProducts: products.length, totalValue, totalStock, lowStock };
  }, [products]);

  // Données graphiques simulées (Ventes)
  const trendData = useMemo(() => {
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    return days.map((day) => ({
      name: day,
      ventes: Math.floor(Math.random() * 50) + 10,
      vues: Math.floor(Math.random() * 100) + 50,
    }));
  }, []);

  if (!user) return <AuthErrorState />;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. EN-TÊTE PRO */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500 p-3 rounded-2xl shadow-lg shadow-teal-200">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase block">
              Boutique
            </span>
            <span className="text-teal-600 font-bold">{user.name}</span>
          </div>
        </header>

        {/* 2. SECTION VISITES (Ton nouveau composant intégré) */}
        {vendorId && (
          <section className="animate-in fade-in duration-700">
            <DashBordVisitAdmin vendorId={vendorId} />
          </section>
        )}

        {/* 3. CARTES DE STOCK & VALEUR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatCard
            title="Valeur Stock"
            value={
              <span className="price">
                {stats.totalValue.toLocaleString()} FCFA
              </span>
            }
            icon={DollarSign}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <QuickStatCard
            title="Produits"
            value={stats.totalProducts}
            icon={Package}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <QuickStatCard
            title="Unités Totales"
            value={stats.totalStock}
            icon={ShoppingCart}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <QuickStatCard
            title="Alertes Stock"
            value={stats.lowStock}
            icon={AlertCircle}
            color="text-orange-600"
            bgColor="bg-orange-50"
            isAlert={stats.lowStock > 0}
          />
        </div>

        {/* 4. GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" /> Tendance
              Hebdomadaire
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventes"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVentes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tableau des produits récents simplifié */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" /> Inventaire Récent
            </h3>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
                      {product.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-400 price">
                        {product.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg ${product.quantity < 5 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-600"}`}
                  >
                    Stock: {product.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS POUR LE CLEAN CODE ---

function QuickStatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  isAlert = false,
}: any) {
  return (
    <div
      className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-md ${isAlert ? "ring-2 ring-orange-100" : ""}`}
    >
      <div
        className={`${bgColor} w-10 h-10 rounded-2xl flex items-center justify-center mb-4`}
      >
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-xl sm:text-2xl font-black text-slate-900 truncate">
        {value}
      </p>
    </div>
  );
}

function AuthErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Accès restreint
        </h2>
        <p className="text-slate-500 mb-8">
          Veuillez vous connecter pour gérer votre boutique.
        </p>
        <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors">
          Se connecter
        </button>
      </div>
    </div>
  );
}
