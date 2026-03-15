"use client";
import { FindAllUserUseCase } from "@/app/users/application/usecases/findAll.user";
import { User } from "@/app/users/domain/entities/user.entity";
import { UserMapper } from "@/app/users/domain/mappers/user.mapper";
import { UserRepository } from "@/app/users/infrastructure/user-repository.impl";
import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Store,
  User as UserIcon,
  RefreshCw,
  ChevronDown,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const userRepo = new UserRepository(new UserMapper());
const findAll = new FindAllUserUseCase(userRepo);

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  admin: {
    label: "Admin",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.1)",
    border: "rgba(192,132,252,0.2)",
  },
  vendeur: {
    label: "Vendeur",
    color: "#67e8f9",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.2)",
  },
  customer: {
    label: "Utilisateur",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.15)",
  },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role?.toLowerCase()] ?? ROLE_CONFIG["customer"];
  const Icon =
    role?.toLowerCase() === "vendeur"
      ? Store
      : role?.toLowerCase() === "admin"
        ? ShieldCheck
        : UserIcon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide flex-shrink-0"
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
      style={{
        background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
      }}
    >
      {initials}
    </div>
  );
}

// ── SelectFilter encapsulé ────────────────────────────────────────────────────
function SelectFilter({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // w-full pour qu'il prenne toute la place dispo sans dépasser
        className="w-full appearance-none pl-3 pr-7 py-2 text-xs font-medium text-slate-300 rounded-xl outline-none cursor-pointer transition-all truncate"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <option value="all" style={{ background: "#0d1117" }}>
          {placeholder}
        </option>
        {options.map((o) => (
          <option
            key={o}
            value={o.toLowerCase()}
            style={{ background: "#0d1117" }}
          >
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
    </div>
  );
}

export default function UserComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const handleFetchUsers = async () => {
    setLoading(true);
    try {
      const data = await findAll.execute();
      setUsers(data);
      toast.success(`${data.length} utilisateurs chargés`);
    } catch {
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  const roles = useMemo(
    () => Array.from(new Set(users.map((u) => u.role).filter(Boolean))),
    [users],
  );

  const cities = useMemo(
    () => Array.from(new Set(users.map((u) => u.cityName).filter(Boolean))),
    [users],
  );

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.cityName?.toLowerCase().includes(q);
      const matchRole =
        roleFilter === "all" || u.role?.toLowerCase() === roleFilter;
      const matchCity = cityFilter === "all" || u.cityName === cityFilter;
      return matchSearch && matchRole && matchCity;
    });
  }, [users, search, roleFilter, cityFilter]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.role?.toLowerCase() === "admin").length,
      vendors: users.filter((u) => u.role?.toLowerCase() === "vendeur").length,
      regular: users.filter((u) => u.role?.toLowerCase() === "customer").length,
    }),
    [users],
  );

  return (
    // overflow-x-hidden sur le root pour tuer tout débordement horizontal
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#090d13" }}
    >
      {/*
        px-4 sur mobile (au lieu de px-4 sm:px-2 qui réduisait trop sur sm)
        w-full + max-w-7xl pour ne jamais dépasser la largeur viewport
      */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Utilisateurs
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gérez les comptes et les rôles de vos utilisateurs.
            </p>
          </div>
          <button
            onClick={handleFetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border self-start sm:self-auto"
            style={{
              background: "rgba(6,182,212,0.08)",
              color: "#67e8f9",
              borderColor: "rgba(6,182,212,0.2)",
            }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>

        {/* ── STATS ──
            grid-cols-2 sur mobile, 4 sur sm+
            Texte tronqué sur petits écrans pour éviter le wrap
        */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "#67e8f9",
              bg: "rgba(6,182,212,0.08)",
              icon: Users,
            },
            {
              label: "Admins",
              value: stats.admins,
              color: "#c084fc",
              bg: "rgba(192,132,252,0.08)",
              icon: ShieldCheck,
            },
            {
              label: "Vendeurs",
              value: stats.vendors,
              color: "#67e8f9",
              bg: "rgba(6,182,212,0.08)",
              icon: Store,
            },
            {
              label: "Clients",
              value: stats.regular,
              color: "#94a3b8",
              bg: "rgba(148,163,184,0.06)",
              icon: UserIcon,
            },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl p-3 sm:p-4 border border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bg }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest truncate">
                    {label}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-100 leading-none mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTERS ──
            Sur mobile : colonne unique
              - barre de recherche pleine largeur
              - les 2 selects côte à côte, chacun flex-1 (50% - gap)
            Sur sm+ : tout sur une ligne
        */}
        <div className="flex flex-col gap-3">
          {/* Search — toujours pleine largeur */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Nom, email, téléphone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-600 rounded-xl outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Selects — côte à côte même sur mobile, flex-1 évite le débordement */}
          <div className="flex gap-2 w-full">
            <SelectFilter
              value={roleFilter}
              onChange={setRoleFilter}
              options={roles}
              placeholder="Tous les rôles"
            />
            <SelectFilter
              value={cityFilter}
              onChange={(v) => setCityFilter(v)}
              options={cities as string[]}
              placeholder="Toutes villes"
            />
          </div>
        </div>

        {/* Result count */}
        {(search || roleFilter !== "all" || cityFilter !== "all") && (
          <p className="text-xs text-slate-500">
            <span className="text-slate-300 font-semibold">
              {filtered.length}
            </span>{" "}
            résultat{filtered.length > 1 ? "s" : ""}
            {search && <span> pour « {search} »</span>}
          </p>
        )}

        {/* ── DESKTOP TABLE ── */}
        <div
          className="hidden md:block rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ background: "rgba(255,255,255,0.025)" }}
        >
          <div
            className="px-6 py-4 flex justify-between items-center border-b border-white/[0.05]"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <h3 className="text-sm font-semibold text-slate-300">
              Liste des utilisateurs
            </h3>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(6,182,212,0.1)",
                color: "#06b6d4",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              {filtered.length} affichés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-[11px] text-slate-600 uppercase tracking-widest font-semibold border-b border-white/[0.04]"
                  style={{ background: "rgba(255,255,255,0.01)" }}
                >
                  <th className="px-6 py-3.5">Utilisateur</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Ville</th>
                  <th className="px-6 py-3.5 text-center">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 animate-spin"
                          style={{
                            borderColor: "#06b6d4",
                            borderTopColor: "transparent",
                          }}
                        />
                        <span className="text-sm text-slate-500">
                          Chargement...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((u, i) => (
                    <tr
                      key={u.id ?? u.email}
                      className="border-b border-white/[0.03] transition-colors group cursor-default"
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
                          <Avatar name={u.name} />
                          <div>
                            <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                              {u.name}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                              <Mail size={10} /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-400 flex items-center gap-1.5">
                          <Phone
                            size={12}
                            className="text-slate-600 flex-shrink-0"
                          />
                          {u.phone || (
                            <span className="text-slate-600 italic text-xs">
                              Non renseigné
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            background: "rgba(16,185,129,0.08)",
                            color: "#6ee7b7",
                            border: "1px solid rgba(16,185,129,0.15)",
                          }}
                        >
                          <MapPin size={11} />
                          {u.cityName || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <RoleBadge role={u.role} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <Search size={22} className="text-slate-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                          {search
                            ? "Aucun résultat pour votre recherche"
                            : "Aucun utilisateur trouvé"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MOBILE CARDS ──
            Corrections clés :
            - min-w-0 sur le conteneur de texte pour autoriser le truncate
            - truncate sur email, nom, téléphone
            - RoleBadge avec flex-shrink-0 (déjà dans le composant)
            - gap réduit pour laisser de la place
        */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "#06b6d4",
                    borderTopColor: "transparent",
                  }}
                />
                <span className="text-xs text-slate-500">Chargement...</span>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((u) => (
              <div
                key={u.id ?? u.email}
                className="rounded-2xl overflow-hidden border border-white/[0.06]"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                {/* Ligne principale : avatar + nom/email + badge rôle */}
                <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                  <Avatar name={u.name} />
                  {/* min-w-0 indispensable pour que truncate fonctionne dans un flex child */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-200 truncate min-w-0">
                        {u.name}
                      </p>
                      <RoleBadge role={u.role} />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 truncate flex items-center gap-1">
                      <Mail size={10} className="flex-shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </p>
                  </div>
                </div>

                <div className="mx-4 border-t border-white/[0.04]" />

                {/* Ligne secondaire : téléphone + ville */}
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 min-w-0 truncate">
                    <Phone size={11} className="text-slate-600 flex-shrink-0" />
                    {u.phone ? (
                      <span className="truncate">{u.phone}</span>
                    ) : (
                      <span className="text-slate-600 italic">
                        Non renseigné
                      </span>
                    )}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0"
                    style={{
                      background: "rgba(16,185,129,0.08)",
                      color: "#6ee7b7",
                      border: "1px solid rgba(16,185,129,0.15)",
                    }}
                  >
                    <MapPin size={10} />
                    {u.cityName || "N/A"}
                  </span>
                </div>
              </div>
            ))
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
                  <Users size={24} className="text-slate-600" />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {search ? "Aucun résultat" : "Aucun utilisateur trouvé"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
