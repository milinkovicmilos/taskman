import { Component, Inject, inject } from '@angular/core';
import { ProjectCard } from '../project-card/project-card';
import { ProjectData } from '../../interfaces/project-data';
import { CreateProjectForm } from '../create-project-form/create-project-form';
import { FormState } from '../../../../shared/services/form-state';
import { PROJECT_STORAGE, ProjectStorage } from '../../interfaces/project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { AuthService } from '../../../../shared/services/auth-service';

@Component({
  selector: 'app-project',
  imports: [ProjectCard, CreateProjectForm],
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
export class Project {
  private storage = inject(PROJECT_STORAGE);

  protected projects: ProjectData[] = [];
  protected createFormVisible = inject(FormState).visible;

  constructor() {
    this.projects = this.storage.getProjects();
  }

  onProjectCreated(project: ProjectData) {
    this.projects.push(project);
  }

  onProjectDeleted(id: number | string) {
    this.storage.removeProject(id);
    this.projects = this.projects.filter(x => x.id != id);
  }
}
