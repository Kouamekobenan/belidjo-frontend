import { TypeNotification } from "../enums/type-notification";

export class Notification {
  constructor(
    public readonly id: string,
    public readonly senderId: string | null,
    public readonly receiverId: string,
    private title: string,
    public message: string,
    public type: TypeNotification,
    public readonly isRead: boolean,
    public readonly createdAt: Date
  ) {}
}
