// notification/presentation/components/SendNotificationModal.tsx
"use client";

import { X } from "lucide-react";
import { SendNotificationForm } from "./SenderNotification";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderId?: string | null;
  receiverId?: string;
}

export const SendNotificationModal = ({
  isOpen,
  onClose,
  senderId,
  receiverId,
}: SendNotificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <SendNotificationForm
            senderId={senderId}
            receiverId={receiverId}
            onSuccess={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};
