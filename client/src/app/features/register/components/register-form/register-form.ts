import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterData } from '../../interfaces/register-data';
import { passwordConfirmValidator } from '../../../../shared/validators/password-confirm-validator';
import { Input } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { symbolValidator } from '../../../../shared/validators/symbol-validator';
import { lowerCaseValidator } from '../../../../shared/validators/lower-case-validator';
import { upperCaseValidator } from '../../../../shared/validators/upper-case-validator';
import { numberCaseValidator } from '../../../../shared/validators/number-validator';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, Input, Button],
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

  @Output() submitted = new EventEmitter<RegisterData>();

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      const { first_name, last_name, email, password, password_confirmation } = this.registerForm.value as {
        first_name: string;
        last_name: string;
        email: string,
        password: string,
        password_confirmation: string;
      };

      const register: RegisterData = {
        first_name,
        last_name,
        email,
        password,
        password_confirmation,
      };

      this.isSubmitted = false;
      this.submitted.emit(register);
    }
  }
}
