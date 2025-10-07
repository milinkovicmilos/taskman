import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-checkbox',
  imports: [],
  templateUrl: './input-checkbox.html',
  styleUrl: './input-checkbox.css'
})
export class InputCheckbox {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;

  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit(this.checked);
  }
}
