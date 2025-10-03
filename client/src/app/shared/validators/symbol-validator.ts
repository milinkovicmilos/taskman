import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function symbolValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /[!@#$%^&*()_+\\\-=\[\]{}]+/;
    const hasSymbol = regex.test(control.value);

    return hasSymbol ? null : { noSymbol: true };
  };
}
