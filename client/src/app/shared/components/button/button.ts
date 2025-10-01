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
  @Input() classList: string[] = [];

  @Output() event = new EventEmitter();

  onClick(): void {
    this.event.emit();
  }
}
