import { Component, inject } from '@angular/core';
import { Button } from '../button/button';
import { FormState } from '../../services/form-state';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormType } from '../../enums/form-type';

@Component({
  selector: 'app-header',
  imports: [RouterModule, Button],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private router = inject(Router);

  authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;

  userData = this.authService.data;
  state = inject(FormState);

  getFullName(): string {
    return `${this.userData().firstName} ${this.userData().lastName}`;
  }

  toggleNewProjectForm(): void {
    this.state.changeState(FormType.Create);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToLogout(): void {
    this.router.navigate(['/logout']);
  }
}
