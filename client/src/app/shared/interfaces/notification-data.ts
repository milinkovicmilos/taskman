import { NotificationType } from "../enums/notification-type";

export interface NotificationData {
  type: NotificationType;
  message: string;
}
