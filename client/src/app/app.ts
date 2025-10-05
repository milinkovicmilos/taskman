import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Notifier } from './shared/services/notifier';
import { Notification } from './shared/components/notification/notification';
import { Modal } from './shared/components/modal/modal';
import { Modal as ModalService } from './shared/services/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Notification, Modal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
  protected readonly notification = inject(Notifier).notification;
  protected readonly modal = inject(ModalService);
}
