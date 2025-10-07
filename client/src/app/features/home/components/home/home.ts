import { Component, inject } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private router: Router = inject(Router);

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  goToGroups(): void {
    this.router.navigate(['/groups']);
  }
}
