import { Component, inject } from '@angular/core';
import { Button } from '../button/button';
import { FormState } from '../../services/form-state';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

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
  state = inject(FormState);

  toggleNewProjectForm() {
    this.state.changeState();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToLogout() {
    this.router.navigate(['/logout']);
  }
}
