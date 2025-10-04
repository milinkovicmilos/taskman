import { Component, Inject, inject, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { ProjectCard } from '../project-card/project-card';
import { ProjectData } from '../../interfaces/project-data';
import { CreateProjectForm } from '../create-project-form/create-project-form';
import { FormState } from '../../../../shared/services/form-state';
import { PROJECT_STORAGE, ProjectStorage } from '../../interfaces/project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { PageNavigation } from '../../../../shared/components/page-navigation/page-navigation';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';

@Component({
  selector: 'app-project',
  imports: [ProjectCard, CreateProjectForm, PageNavigation],
  templateUrl: './project.html',
  styleUrl: './project.css',
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
export class Project implements OnInit {
  private storage = inject(PROJECT_STORAGE);
  private notificationService = inject(Notifier);

  @Output() protected lastPage: WritableSignal<number> = signal(1);

  protected projects: ProjectData[] = [];
  protected createFormVisible = inject(FormState).visible;

  ngOnInit() {
    this.storage.getProjects().subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.projects = response.data;
      }
    })
  }

  onProjectCreated(project: ProjectData) {
    this.storage.getProjects().subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.projects = response.data;
        this.notificationService.notify({
          type: NotificationType.Info,
          message: `Successfully created project ${project.name}`,
        });
      }
    })
  }

  onProjectDeleted(id: number | string) {
    this.storage.removeProject(id);
    this.storage.getProjects().subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.projects = response.data;
      }
    })
  }

  onPageChange(number: number) {
    this.storage.getProjects(number).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.projects = response.data;
      }
    })
  }
}
