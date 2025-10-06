import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dueDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') {
      return null;
    }

    const date = new Date(control.value);
    const now = new Date();
    const todaysDate = new Date(now.toISOString().split('T')[0])

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return todaysDate <= date ? null : { invalidDueDate: true };
  };
}
