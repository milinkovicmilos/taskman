import { Component, forwardRef, Input as InputProp } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    }
  ],
})
export class Input implements ControlValueAccessor {
  @InputProp() id: string = '';
  @InputProp() type: string = 'text';
  @InputProp() placeholder: string = '';
  @InputProp() label: string = '';

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
