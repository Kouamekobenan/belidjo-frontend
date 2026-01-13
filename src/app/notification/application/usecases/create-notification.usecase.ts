import { Notification } from "../../domain/entities/notification.entity";
import { INotificationRepository } from "../../domain/interfaces/notification-repository";
import { CreateNotificationDto } from "../dtos/create-notification.dto";

export class CreateNotificationUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}
  async execute(dto: CreateNotificationDto): Promise<Notification> {
    return await this.notificationRepo.create(dto);
  }
}
