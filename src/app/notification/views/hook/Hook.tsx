// notification/presentation/hooks/useSendNotification.ts
import { useState } from "react";
import { CreateNotificationDto } from "../../application/dtos/create-notification.dto";
import { NotificationRepository } from "../../infrastructure/notification.repository";
import { CreateNotificationUseCase } from "../../application/usecases/create-notification.usecase";

const notificationRepo= new NotificationRepository()
const notificationService= new CreateNotificationUseCase(notificationRepo)
export const useSendNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendNotification = async (dto: CreateNotificationDto) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await notificationService.execute(dto);

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de la notification");
      console.error("Erreur:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    sendNotification,
    loading,
    error,
    success,
    resetState,
  };
};
