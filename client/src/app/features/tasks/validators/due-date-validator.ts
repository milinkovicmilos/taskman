import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dueDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') {
      return null;
    }

    const date = new Date(control.value);
    const now = new Date();

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return now < date ? null : { invalidDueDate: true };
  };
}
