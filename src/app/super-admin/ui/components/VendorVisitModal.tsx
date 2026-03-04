"use client";
import React, { useState } from "react";
import { X, BarChart3 } from "lucide-react";
import DashBordVisitAdmin from "@/app/visit/views/VisitDahBoard";

interface VendorVisitModalProps {
  vendorId: string;
  vendorName: string;
}
export default function VendorVisitModal({
  vendorId,
  vendorName,
}: VendorVisitModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      <button
        onClick={openModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow-md"
        title="Voir les statistiques de visites"
      >
        <BarChart3 size={13} />
        <span className="hidden sm:inline">Statistiques</span>
      </button>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    Statistiques de visites
                  </h2>
                  <p className="text-sm text-slate-600 mt-0.5">{vendorName}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                  title="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
              {/* Content */}
              <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <DashBordVisitAdmin vendorId={vendorId} />
              </div>
              {/* Footer (optionnel) */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
