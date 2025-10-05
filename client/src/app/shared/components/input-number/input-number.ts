import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  imports: [],
  templateUrl: './input-number.html',
  styleUrl: './input-number.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumber),
      multi: true,
    }
  ],
})
export class InputNumber implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';

  disabled: boolean = false;
  value: any = null;

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

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouch();
  }
}
