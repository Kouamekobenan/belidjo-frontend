import { TypeNotification } from "../enums/type-notification";

export class Notification {
  constructor(
    public readonly id: string,
    public readonly senderId: string | null,
    public readonly receiverId: string,
    public title: string,
    public message: string,
    public type: TypeNotification | string,
    public readonly isRead: boolean,
    public readonly createdAt: Date | string,
    public readonly imageUrl?: string | null,
    public readonly actionUrl?: string | null,
    public readonly priority?: string,
    public readonly channel?: string,
    public readonly metadata?: Record<string, any> | null
  ) {}
}

