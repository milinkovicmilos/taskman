import { Component, inject } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth-service';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';

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
  private formStateSerivce = inject(FormState);

  startProject(): void {
    this.router.navigate(['/projects'], { queryParams: { start: true } });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToProjects(): void {
  }

  goToGroups(): void {
    this.router.navigate(['/groups']);
  }
}
