import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function priorityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return { invalidPriority: true };
    }

    return numberValue >= 1 && numberValue <= 10 ? null : { invalidPriority: true };
  };
}
