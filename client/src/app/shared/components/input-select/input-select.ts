import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-select',
  imports: [],
  templateUrl: './input-select.html',
  styleUrl: './input-select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelect),
      multi: true,
    }
  ],
})
export class InputSelect implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() options: { label: string, value: any }[] = [];
  @Input() value: any = '';

  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

  disabled: boolean = false;

  onChange: any = (_: any) => { }
  onTouch: any = () => { }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);

    this.valueChanged.emit(this.value);
  }

  onBlur(): void {
    this.onTouch();
  }
}
