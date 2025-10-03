import { Component, inject } from '@angular/core';
import { LoginForm } from '../login-form/login-form';
import { Router, RouterModule } from '@angular/router';
import { LoginData } from '../../interfaces/login-data';
import { AuthService } from '../../../../shared/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService = inject(AuthService);
  private router = inject(Router);

  onLoginSubmit(data: LoginData) {
    this.authService.login(data).subscribe(
      response => {
        this.router.navigate(['/']);
      },
      error => {
        console.log(error);
      }
    );
  }
}
