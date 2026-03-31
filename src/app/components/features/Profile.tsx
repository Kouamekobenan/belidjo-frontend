"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import React from "react";
import {
  User,
  Phone,
  MapPin,
  Shield,
  Calendar,
  ArrowLeft,
  LogIn,
  CheckCircle,
  Settings,
  ShoppingBag,
  Edit,
} from "lucide-react";
// ─── Composant Avatar avec initiales ───────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="relative inline-flex">
      {/* Anneau animé */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-400 via-cyan-400 to-blue-500 animate-spin-slow p-[3px]" />
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-3xl font-bold shadow-xl ring-4 ring-white z-10">
        {initials}
      </div>
      {/* Badge actif */}
      <span className="absolute bottom-1 right-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 ring-2 ring-white">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </span>
    </div>
  );
}

// ─── Carte d'info individuelle ──────────────────────────────────────────────
function InfoCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | undefined | null;
  accent?: boolean;
}) {
  return (
    <div
      className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        accent
          ? "bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 hover:border-teal-400"
          : "bg-white border-gray-100 hover:border-gray-300"
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          accent
            ? "bg-teal-500 text-white"
            : "bg-gray-100 text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm font-medium truncate ${
            accent ? "text-teal-700" : "text-gray-800"
          }`}
        >
          {value || <span className="text-gray-400 italic">Non renseigné</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Badge de rôle ──────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    CUSTOMER: {
      label: "Client",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    VENDOR: {
      label: "Vendeur",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    ADMIN: {
      label: "Administrateur",
      cls: "bg-purple-50 text-purple-700 border-purple-200",
    },
  };
  const { label, cls } = map[role] ?? {
    label: role,
    cls: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      <CheckCircle className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

// ─── Formatage de date ──────────────────────────────────────────────────────
function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ─── Page "non connecté" ────────────────────────────────────────────────────
function NotLoggedIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-10 text-center">
        {/* Icône */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
          <User className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Accès à votre profil
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Connectez-vous avec votre numéro de téléphone et votre mot de passe
          pour accéder à votre espace personnel.
        </p>
        <Link
          href="/users/ui/login"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <LogIn className="w-5 h-5" />
          Se connecter
        </Link>
        <Link
          href="/vendor"
          className="mt-3 inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-50 text-gray-600 font-medium rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

// ─── Composant principal ────────────────────────────────────────────────────
export default function ProfileComponent() {
  const { user } = useAuth();

  if (!user) return <NotLoggedIn />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-100/60">
      {/* ── Bannière hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500">
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-cyan-300 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/vendor"
              className="inline-flex cursor-pointer items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>
            <Link
              href={`/profile/${user.id}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier mon profil
            </Link>
          </div>
          {/* Identité dans la bannière */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 pb-2">
            <Avatar name={user.name} />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                {user.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <RoleBadge role={user.role} />
                {user.cityName && (
                  <span className="inline-flex items-center gap-1 text-white/80 text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    {user.cityName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ── Contenu principal ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Message de bienvenue */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-5 flex items-center gap-4 text-white shadow-lg shadow-teal-200">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              Bienvenue, {user.name.split(" ")[0]} !
            </p>
            <p className="text-white/80 text-xs mt-0.5">
              Votre compte est actif et sécurisé. Retrouvez toutes vos
              informations ci-dessous.
            </p>
          </div>
        </div>
        {/* Grille d'informations */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
            Informations personnelles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard
              icon={User}
              label="Nom complet"
              value={user.name}
              accent
            />
            <InfoCard icon={Phone} label="Téléphone" value={user.phone} />
            <InfoCard icon={MapPin} label="Ville" value={user.cityName} />
            <InfoCard
              icon={Shield}
              label="Rôle du compte"
              value={
                user.role === "CUSTOMER"
                  ? "Client"
                  : user.role === "VENDEUR"
                    ? "Vendeur"
                    : user.role
              }
            />
            <InfoCard
              icon={Calendar}
              label="Membre depuis"
              value={formatDate(user.createdAt)}
            />
          </div>
        </div>

        {/* Actions rapides */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/vendor"
              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Mes commandes
                </p>
                <p className="text-xs text-gray-400">
                  Suivre mes achats en cours
                </p>
              </div>
            </Link>
            <Link
              href={`/profile/${user.id}`}
              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Paramètres
                </p>
                <p className="text-xs text-gray-400">
                  Modifier mes informations
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer discret */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Dernière connexion aujourd'hui •
          <Link
            href="/users/ui/login"
            className="text-teal-500 hover:underline"
          >
            Se déconnecter
          </Link>
        </p>
      </div>
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
