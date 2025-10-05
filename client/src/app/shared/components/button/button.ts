import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {
  @Input() text: string = '';
  @Input() type: string = 'button';
  @Input() classList: string[] = [];

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick(event: Event): void {
    event.stopPropagation();
    this.clicked.emit();
  }
}
