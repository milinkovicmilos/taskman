import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function numberCaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /[\d]+/;
    const hasSymbol = regex.test(control.value);

    return hasSymbol ? null : { noNumber: true };
  };
}
