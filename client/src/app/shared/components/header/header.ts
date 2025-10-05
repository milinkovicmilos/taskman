import { Component, inject, signal } from '@angular/core';
import { Button } from '../button/button';
import { FormState } from '../../services/form-state';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormType } from '../../enums/form-type';
import { filter } from 'rxjs';

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
  state = inject(FormState);

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

  protected isProductsPage(): boolean {
    const regex = /^\/projects$/;
    return regex.test(this.router.url);
  }

  protected isProductDetailPage(): boolean {
    // UUID REGEX: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
    const regex = /^\/projects\/(\d+|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
    return regex.test(this.router.url);
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
