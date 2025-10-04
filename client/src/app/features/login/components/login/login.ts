import { Component, inject } from '@angular/core';
import { LoginForm } from '../login-form/login-form';
import { Router, RouterModule } from '@angular/router';
import { LoginData } from '../../interfaces/login-data';
import { AuthService } from '../../../../shared/services/auth-service';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';

@Component({
  selector: 'app-login',
  imports: [RouterModule, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService = inject(AuthService);
  private router = inject(Router);

  private notificationService = inject(Notifier);

  onLoginSubmit(data: LoginData) {
    this.authService.login(data).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.notificationService.notify({
            type: NotificationType.Error,
            message: error.error.message,
          });
        }
      }
    });
  }
}
