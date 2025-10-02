import { Component } from '@angular/core';
import { LoginForm } from '../login-form/login-form';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
