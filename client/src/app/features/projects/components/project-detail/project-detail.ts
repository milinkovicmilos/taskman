import { Component, Input, OnInit, inject } from '@angular/core';
import { ProjectDetailData } from '../../interfaces/project-data';
import { PROJECT_STORAGE } from '../../interfaces/project-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { ProjectRole } from '../../enums/project-role';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-project-detail',
  imports: [Button],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
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
export class ProjectDetail implements OnInit {
  private storage = inject(PROJECT_STORAGE);
  protected project!: ProjectDetailData;
  protected projectRoles = ProjectRole;

  @Input() protected id!: number | string;

  ngOnInit(): void {
    this.storage.getProject(this.id).subscribe({
      next: (response) => {
        this.project = response;
      }
    });
  }
}
