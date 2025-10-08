import { Component, inject } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth-service';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private authService = inject(AuthService);
  protected isLoggedIn = this.authService.isLoggedIn;

  private router: Router = inject(Router);

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  goToGroups(): void {
    this.router.navigate(['/groups']);
  }
}
