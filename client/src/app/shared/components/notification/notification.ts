import { Component, Input } from '@angular/core';
import { NotificationData } from '../../interfaces/notification-data';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification {
  @Input() data!: NotificationData
}
