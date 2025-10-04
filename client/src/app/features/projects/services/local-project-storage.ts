import { Injectable } from '@angular/core';
import { ProjectStorage } from '../interfaces/project-storage';
import { ProjectData } from '../interfaces/project-data';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { ProjectResponse } from '../interfaces/project-response';
import { CreatedProjectResponse } from '../interfaces/created-project-response';
import { CreateProjectData } from '../interfaces/create-project-data';

@Injectable({
  providedIn: 'root',
})
export class LocalProjectStorage implements ProjectStorage {
  localStorageGet(): string | null {
    return localStorage.getItem("projects");
  }

  localStorageSet(value: object | []): void {
    localStorage.setItem("projects", JSON.stringify(value));
  }

  constructor() {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      localStorage.setItem("projects", "[]");
    }
  }

  getProjects(page: number = 1): Observable<PaginatedResponse<ProjectResponse> | null> {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return of(null);
    }

    const data = JSON.parse(projectsData);
    const perPage = 4;
    const offset = perPage * (page - 1);
    const response: PaginatedResponse<ProjectResponse> = {
      current_page: page,
      per_page: 4,
      total: data.length,
      last_page: Math.ceil(data.length / perPage),
      data: data.splice(offset, perPage),
    }
    return of(response);
  }

  storeProject(project: CreateProjectData): Observable<any> {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return of(null);
    }

    const projects = JSON.parse(projectsData);
    const projectToStore: ProjectData = {
      id: crypto.randomUUID(),
      name: project.name,
      description: project.description,
    }
    projects.push(projectToStore);

    this.localStorageSet(projects);
    const data: CreatedProjectResponse = {
      message: 'Successfully created a project.',
      data: {
        id: projectToStore.id,
      }
    }
    return of(data);
  }

  updateProject(projectId: number | string, project: ProjectData): void {

  }

  removeProject(projectId: number | string): void {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return;
    }

    const tmpProjects: ProjectData[] = JSON.parse(projectsData);
    const projects = tmpProjects.filter(x => x.id != projectId);

    this.localStorageSet(projects);
  }
}
