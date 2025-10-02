import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginData } from '../../interfaces/login-data';
import { Input } from '../../../../shared/components/input/input';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, Input, Button],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  private formBuilder = inject(FormBuilder);
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected isSubmitted: boolean = false;
  protected email = this.loginForm.get('title');
  protected password = this.loginForm.get('description');

  @Output() submitted = new EventEmitter<LoginData>();

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value as {
        email: string,
        password: string,
      };

      const login: LoginData = {
        email,
        password
      };

      this.isSubmitted = false;
      this.submitted.emit(login);
    }
  }
}
