"use client";
import { useAuth } from "@/app/context/AuthContext";
import { logoNoBoutik } from "@/app/lib/globals.type";
import { FindAllVendorUseCase } from "@/app/vendor/application/usecases/findAll-vendor.usecase";
// import { ApproveVendorUseCase } from "@/app/vendor/application/usecases/approve-vendor.usecase"; // Import du UseCase
import { Vendor } from "@/app/vendor/domain/entities/vendor.entity";
import { VendorRepository } from "@/app/vendor/infrastructure/api/vendor.api";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// Remplacement par Lucide React
import {
  Users,
  CheckCircle,
  XCircle,
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { ApproveVendorUseCase } from "@/app/vendor/application/usecases/approve-vendor.usecase";
import toast from "react-hot-toast";

const repoVendor = new VendorRepository();
const findAllVendorUseCase = new FindAllVendorUseCase(repoVendor);
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
      console.error("Erreur récupération vendeurs");
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
      await approveVendorUseCase.execute(vendorId);
      toast.success("Le statut a été mis à jour avec succès !", {
        id: loadingToast, // On remplace le toast de chargement par celui de succès
      });
      fetchVendors();
    } catch (error) {
      alert("Erreur lors de la modification du statut");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-gray-100">
            {/* Icône animée */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>

            {/* Titre et message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Authentification requise
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Veuillez vous connecter pour gerer votre espace admin.
              </p>
            </div>

            {/* Bouton de connexion */}
            <Link
              href="/users/ui/login"
              className="group relative inline-flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <LogIn className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Se connecter</span>
            </Link>

            {/* Lien secondaire */}
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <Link
                href="/users/ui/register"
                className="text-teal-600 hover:text-teal-700 font-medium underline-offset-4 hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <Image
          src={logoNoBoutik}
          width={100}
          height={40}
          alt="Logo"
          className="object-contain"
        />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-400 uppercase">
              Administrateur
            </p>
            <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 mb-10 w-full md:w-72">
          <div className="p-4 bg-indigo-50 text-teal-600 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Partenaires</p>
            <h2 className="text-3xl font-extrabold text-slate-900">{total}</h2>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800 italic">
              Liste des boutiques partenaires
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="px-8 py-4">Boutique</th>
                  <th className="px-8 py-4">Contact</th>
                  <th className="px-8 py-4">Ville</th>
                  <th className="px-8 py-4">Statut</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-20 text-center text-slate-400"
                    >
                      Chargement...
                    </td>
                  </tr>
                ) : vendors.length > 0 ? (
                  vendors.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50/80 transition-all group"
                    >
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                          {v.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Globe size={12} /> {v.site.domain}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm">
                        <p className="font-medium text-slate-700">
                          {v.user.name}
                        </p>
                        <div className="text-xs text-slate-400 space-y-0.5 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} /> {v.user.phone}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail size={12} /> {v.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        {v.user.cityName}
                      </td>
                      <td className="px-8 py-5">
                        {v.isApproved ? (
                          <span className="flex items-center w-fit gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase">
                            <CheckCircle size={12} /> Actif
                          </span>
                        ) : (
                          <span className="flex items-center w-fit gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase">
                            <XCircle size={12} /> En attente
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => handleToggleStatus(v.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border
                            ${
                              v.isApproved
                                ? "text-red-600 bg-white border-red-100 hover:bg-red-50 hover:border-red-200"
                                : "text-white bg-teal-600 border-transparent hover:bg-teal-700 shadow-indigo-100"
                            }`}
                        >
                          <ShieldCheck size={14} />
                          {v.isApproved ? "Désactiver" : "Approuver"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <p className="text-slate-400 font-medium italic">
                        Aucun partenaire enregistré
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
