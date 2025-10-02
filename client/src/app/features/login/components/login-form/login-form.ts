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
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected submitted: boolean = false;
  protected username = this.loginForm.get('title');
  protected password = this.loginForm.get('description');

  @Output() created = new EventEmitter<LoginData>();

  handleSubmit(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value as {
        username: string,
        password: string,
      };

      const login: LoginData = {
        username,
        password
      };

      this.submitted = false;
      this.created.emit(login);
    }
  }
}
