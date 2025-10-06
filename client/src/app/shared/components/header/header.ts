import { Component, inject, signal } from '@angular/core';
import { Button } from '../button/button';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { filter } from 'rxjs';
import { HeaderButton } from '../../services/header-button';

@Component({
  selector: 'app-header',
  imports: [RouterModule, Button],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private router = inject(Router);
  protected url = signal(this.router.url);

  authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;

  userData = this.authService.data;
  buttonService = inject(HeaderButton);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          this.url.set(event.urlAfterRedirects);
        }
      });
  }

  getFullName(): string {
    return `${this.userData().firstName} ${this.userData().lastName}`;
  }

  onMainHeaderButtonClick(): void {
    this.buttonService.clicked();
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

  protected goBack(): void {
    const url = this.url().split('/');
    if (url.length > 1) {
      url.pop();
      this.router.navigate([`/${url.join('/')}`]);
    }
    else {
      this.router.navigate(['/']);
    }
  }
}
