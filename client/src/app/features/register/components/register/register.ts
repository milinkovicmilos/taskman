import { Component } from '@angular/core';
import { RegisterForm } from '../register-form/register-form';
import { RegisterData } from '../../interfaces/register-data';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterModule, RegisterForm],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  onRegisterSubmit(data: RegisterData) {
    // ...
  }
}
