"use client";
import { Vendor } from "@/app/vendor/domain/entities/vendor.entity";
import { VendorRepository } from "@/app/vendor/infrastructure/api/vendor.api";
import { GetAllVendorUseCase } from "@/app/vendor/application/usecases/getAll-vendor.usecase";
import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Bell,
  Users,
  CheckCircle,
  Star,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const repoVendor = new VendorRepository();
const findAllVendorUseCase = new GetAllVendorUseCase(repoVendor);

interface VendorStats {
  total: number;
  approved: number;
  featured: number;
  pending: number;
}

export default function SuperAdmin() {
  const { user } = useAuth();
  const [vendorStats, setVendorStats] = useState<VendorStats>({
    total: 0,
    approved: 0,
    featured: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await findAllVendorUseCase.execute(100, 1);
        const data: Vendor[] = res.data;
        setVendorStats({
          total: res.total,
          approved: data.filter((v) => v.isApproved).length,
          featured: data.filter((v) => v.isFeatured).length,
          pending: data.filter((v) => !v.isApproved).length,
        });
      } catch {
        // silent — stats resteront à 0
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const sections = [
    {
      href: "/super-admin/vendors",
      icon: Store,
      label: "Boutiques",
      description: "Approuver, révoquer et gérer les partenaires",
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.08)",
      border: "rgba(6,182,212,0.15)",
    },
    {
      href: "/super-admin/users",
      icon: Users,
      label: "Utilisateurs",
      description: "Consulter et filtrer les comptes",
      color: "#c084fc",
      bg: "rgba(192,132,252,0.08)",
      border: "rgba(192,132,252,0.15)",
    },
    {
      href: "/super-admin/city",
      icon: MapPin,
      label: "Villes",
      description: "Ajouter et gérer les villes disponibles",
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.15)",
    },
    {
      href: "/super-admin/notification",
      icon: Bell,
      label: "Notifications",
      description: "Envoyer des messages aux utilisateurs",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.15)",
    },
  ];

  const kpis = [
    {
      icon: Store,
      label: "Total boutiques",
      value: vendorStats.total,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.08)",
    },
    {
      icon: CheckCircle,
      label: "Boutiques actives",
      value: vendorStats.approved,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
    },
    {
      icon: ShieldCheck,
      label: "En attente",
      value: vendorStats.pending,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
    },
    {
      icon: Star,
      label: "En vedette",
      value: vendorStats.featured,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
    },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "#090d13" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-8 w-full">
        {/* HEADER */}
        <div className="space-y-1">
          <p className="text-slate-500 text-sm">Bienvenue,</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            {user?.name ?? "Administrateur"}
          </h1>
          <p className="text-slate-600 text-sm">
            Vue d&apos;ensemble de votre plateforme NoBoutik.
          </p>
        </div>

        {/* KPI CARDS */}
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-3">
            Aperçu boutiques
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {kpis.map(({ icon: Icon, label, value, color, bg }) => (
              <div
                key={label}
                className="rounded-2xl p-4 border border-white/[0.06] transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: bg }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-2xl font-bold text-slate-100 leading-none">
                  {loading ? (
                    <span
                      className="inline-block w-8 h-6 rounded animate-pulse"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />
                  ) : (
                    value
                  )}
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACCESS */}
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-3">
            Gestion
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sections.map(
              ({ href, icon: Icon, label, description, color, bg, border }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-2xl border border-white/[0.06] p-5 transition-all duration-200 hover:border-white/[0.12] hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: bg, border: `1px solid ${border}` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-200 group-hover:text-slate-100 transition-colors">
                          {label}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-all group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* PENDING ALERT */}
        {!loading && vendorStats.pending > 0 && (
          <Link
            href="/super-admin/vendors"
            className="flex items-center gap-4 rounded-2xl p-4 border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: "rgba(245,158,11,0.06)",
              borderColor: "rgba(245,158,11,0.2)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(245,158,11,0.12)" }}
            >
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-300">
                {vendorStats.pending} boutique
                {vendorStats.pending > 1 ? "s" : ""} en attente d&apos;approbation
              </p>
              <p className="text-xs text-amber-500/70 mt-0.5">
                Cliquer pour les gérer dans la section Boutiques
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-500/60 flex-shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
}
