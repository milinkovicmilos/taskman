import { Injectable, signal, WritableSignal } from '@angular/core';
import { NotificationData } from '../interfaces/notification-data';
import { NotificationType } from '../enums/notification-type';

@Injectable({
  providedIn: 'root'
})
export class Notifier {
  private timeout: number = 5000;
  private timeoutId!: number;
  notification: WritableSignal<NotificationData> = signal({ type: NotificationType.Info, message: '' });

  private clearNotification(): void {
    this.notification.set({ type: NotificationType.Info, message: '' });
  }

  notify(data: NotificationData): void {
    this.clearNotification();
    clearTimeout(this.timeoutId);

    this.notification.set(data);
    this.timeoutId = setTimeout(() => this.clearNotification(), this.timeout);
  }
}
