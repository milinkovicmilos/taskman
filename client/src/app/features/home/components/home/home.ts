import { Component, inject, OnInit } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth-service';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';
import { PROJECT_STORAGE } from '../../../projects/interfaces/project-storage';
import { ServerProjectStorage } from '../../../projects/services/server-project-storage';
import { LocalProjectStorage } from '../../../projects/services/local-project-storage';
import { ProjectData } from '../../../projects/interfaces/project-data';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [
    {
      provide: PROJECT_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerProjectStorage() : new LocalProjectStorage();
      }),
    },
  ],
})
export class Home implements OnInit {
  private projectStorage = inject(PROJECT_STORAGE);
  protected newestProject!: ProjectData;

  private authService = inject(AuthService);
  protected isLoggedIn = this.authService.isLoggedIn;

  protected userData = this.authService.data;
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.projectStorage.getProjects().subscribe({
      next: (response) => {
        this.newestProject = response.data[0];
      }
    });
  }

  protected startProject(): void {
    this.router.navigate(['/projects'], { queryParams: { start: true } });
  }

  protected goToRegister(): void {
    this.router.navigate(['/register']);
  }

  protected goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  protected goToRecentProject(): void {
    this.router.navigate(['/projects', this.newestProject.id])
  }
}
