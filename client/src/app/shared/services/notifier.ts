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

  notify(data: NotificationData): void {
    this.notification.set(data);
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.notification.set({ type: NotificationType.Info, message: '' }), this.timeout)
  }
}
