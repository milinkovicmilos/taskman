import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function lowerCaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /[a-z]+/;
    const hasSymbol = regex.test(control.value);

    return hasSymbol ? null : { noLowerCase: true };
  };
}
