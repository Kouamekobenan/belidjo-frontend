import { CreateNotificationDto } from "../../application/dtos/create-notification.dto";
import { Notification } from "../entities/notification.entity";

export interface INotificationRepository{
    create(dto:CreateNotificationDto):Promise<Notification>
}
