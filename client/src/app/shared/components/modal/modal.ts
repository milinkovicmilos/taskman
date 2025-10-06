import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { Modal as ModalService } from '../../services/modal';

@Component({
  selector: 'app-modal',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  private service = inject(ModalService);

  protected text = this.service.text;

  @Output() confirmed: EventEmitter<void> = new EventEmitter<void>();

  onConfirm() {
    this.service.changeState();
    this.confirmed.emit();
  }

  onClose() {
    this.service.changeState();
  }
}
