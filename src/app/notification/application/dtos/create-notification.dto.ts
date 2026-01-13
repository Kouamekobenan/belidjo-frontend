import { TypeNotification } from "../../domain/enums/type-notification";

export interface CreateNotificationDto{
    senderId:string,
    receiverId:string,
    title:string,
    message:string,
    type:TypeNotification,
    isRead:boolean
}