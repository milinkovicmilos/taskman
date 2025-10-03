import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function upperCaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /[A-Z]+/;
    const hasSymbol = regex.test(control.value);

    return hasSymbol ? null : { noUpperCase: true };
  };
}
