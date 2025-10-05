import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-date',
  imports: [],
  templateUrl: './input-date.html',
  styleUrl: './input-date.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDate),
      multi: true,
    }
  ],
})
export class InputDate implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() min: string = '';
  @Input() max: string = '';

  disabled: boolean = false;
  value: any = '';

  onChange: any = (_: any) => { }
  onTouch: any = () => { }

  writeValue(value: any): void {
    value != null ? this.value = value : this.value = '';
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

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouch();
  }
}
