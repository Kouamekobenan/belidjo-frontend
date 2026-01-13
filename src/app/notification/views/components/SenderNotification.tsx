"use client";

import { useState, useEffect } from "react";
import {
  Send,
  X,
  CheckCircle,
  AlertCircle,
  User as UserIcon,
} from "lucide-react";
import { useSendNotification } from "../hook/Hook";
import { TypeNotification } from "../../domain/enums/type-notification";
import { useAuth } from "@/app/context/AuthContext";
import { CreateNotificationDto } from "../../application/dtos/create-notification.dto";
import { User } from "@/app/users/domain/entities/user.entity";
import { UserRepository } from "@/app/users/infrastructure/user-repository.impl";
import { UserMapper } from "@/app/users/domain/mappers/user.mapper";
import { FindAllUserUseCase } from "@/app/users/application/usecases/findAll.user";

interface SendNotificationFormProps {
  senderId?: string | null;
  receiverId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Instances en dehors du composant pour éviter les re-créations inutiles
const userRepo = new UserRepository(new UserMapper());
const findAllUserUseCase = new FindAllUserUseCase(userRepo);

export const SendNotificationForm = ({
  receiverId: defaultReceiverId,
  onSuccess,
  onCancel,
}: SendNotificationFormProps) => {
  const { sendNotification, loading, error, success, resetState } =
    useSendNotification();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState<CreateNotificationDto>({
    senderId: "",
    receiverId: defaultReceiverId || "",
    title: "",
    message: "",
    type: TypeNotification.SYSTEM,
    isRead: false,
  });

  // Correction : Initialisation en tant que tableau vide
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await findAllUserUseCase.execute();
        // Filtrer pour ne pas s'envoyer de notification à soi-même (optionnel)
        setUsers(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Échec du chargement des utilisateurs", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (success) {
      setFormData({
        senderId: "",
        receiverId: defaultReceiverId || "",
        title: "",
        message: "",
        type: TypeNotification.SYSTEM,
        isRead: false,
      });
      setErrors({});
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          resetState();
        }, 2000);
      }
    }
  }, [success, defaultReceiverId, onSuccess, resetState]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.receiverId)
      newErrors.receiverId = "Veuillez choisir un destinataire";
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.message.trim()) newErrors.message = "Le message est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !currentUser) return;
    await sendNotification({ ...formData, senderId: currentUser.id });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Envoyer une notification
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={22} className="text-green-500" />
          <span className="font-medium">
            Notification envoyée avec succès !
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={22} className="text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- LE SELECT DESTINATAIRE --- */}
        {!defaultReceiverId && (
          <div>
            <label
              htmlFor="receiverId"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Choisir le destinataire <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="receiverId"
                name="receiverId"
                value={formData.receiverId}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl appearance-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all ${
                  errors.receiverId ? "border-red-500" : "border-gray-200"
                }`}
              >
                <option value="">Sélectionner un utilisateur...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <UserIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            {errors.receiverId && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.receiverId}
              </p>
            )}
          </div>
        )}
        {/* Type de notification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
            >
              <option value={TypeNotification.SYSTEM}>Message Système</option>
              <option value={TypeNotification.PROMO}>Promotion</option>
              <option value={TypeNotification.ORDER_STATUS}>
                Statut Commande
              </option>
              <option value={TypeNotification.REMINDER}>Rappel</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500 transition-all ${
                errors.title ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Ex: Mise à jour compte"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-teal-500 transition-all resize-none ${
              errors.message ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Écrivez votre message ici..."
          />
          <p className="mt-2 text-right text-xs text-gray-400">
            {formData.message.length}/500
          </p>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 cursor-pointer bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
            Envoyer la notification
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
