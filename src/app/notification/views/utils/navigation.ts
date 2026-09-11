import { Notification } from "../../domain/entities/notification.entity";

export const getNotificationTargetUrl = (notification: Notification): string | null => {
  if (notification.actionUrl) return notification.actionUrl;

  const metadata = notification.metadata || {};

  if (metadata.productId) {
    return `/products/ui/pages/page/${metadata.productId}`;
  }

  if (metadata.vendorId) {
    return `/products/ui/pages/page/${metadata.vendorId}`;
  }

  if (metadata.orderId) {
    return `/orders/${metadata.orderId}`;
  }

  if (metadata.url) {
    return metadata.url;
  }

  return null;
};
