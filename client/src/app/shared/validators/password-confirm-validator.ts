import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordConfirmValidator(passwordInputKey: string, confirmPasswordInputKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordInputKey)?.value;
    const confirmPassword = control.get(confirmPasswordInputKey)?.value;

    if (password == null || confirmPassword == null || password === confirmPassword) {
      return null;
    }

    return { passwordConfirmationMismatch: true };
  };
}
