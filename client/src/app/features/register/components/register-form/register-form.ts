import { Component, EventEmitter, inject, Input, Output, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterData } from '../../interfaces/register-data';
import { passwordConfirmValidator } from '../../../../shared/validators/password-confirm-validator';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { symbolValidator } from '../../../../shared/validators/symbol-validator';
import { lowerCaseValidator } from '../../../../shared/validators/lower-case-validator';
import { upperCaseValidator } from '../../../../shared/validators/upper-case-validator';
import { numberCaseValidator } from '../../../../shared/validators/number-validator';
import { ServerError } from '../../../../shared/interfaces/server-error';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, InputElement, Button],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'
})
export class RegisterForm {
  private formBuilder = inject(FormBuilder);
  registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.maxLength(255)]],
    lastName: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), lowerCaseValidator(), upperCaseValidator(), symbolValidator(), numberCaseValidator()]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordConfirmValidator('password', 'confirmPassword') });

  protected isSubmitted: boolean = false;
  protected firstName = this.registerForm.get('firstName');
  protected lastName = this.registerForm.get('lastName');
  protected email = this.registerForm.get('email');
  protected password = this.registerForm.get('password');
  protected confirmPassword = this.registerForm.get('confirmPassword');

  @Input() serverErrors!: WritableSignal<ServerError[]>;

  @Output() submitted = new EventEmitter<RegisterData>();

  getServerErrors(propertyName: string): string[] {
    for (const error of this.serverErrors()) {
      if (error.property == propertyName) {
        return error.errors;
      }
    }

    return [];
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    this.serverErrors.set([]);
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password, confirmPassword } = this.registerForm.value as {
        firstName: string;
        lastName: string;
        email: string,
        password: string,
        confirmPassword: string;
      };

      const register: RegisterData = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: confirmPassword,
      };

      this.isSubmitted = false;
      this.registerForm.markAsUntouched();
      this.submitted.emit(register);
    }
  }
}
