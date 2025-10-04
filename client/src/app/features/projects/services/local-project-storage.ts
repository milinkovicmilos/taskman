import { Injectable } from '@angular/core';
import { ProjectStorage } from '../interfaces/project-storage';
import { ProjectData } from '../interfaces/project-data';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { ProjectResponse } from '../interfaces/project-response';

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
    const response: PaginatedResponse<ProjectResponse> = {
      current_page: page,
      per_page: 4,
      total: data.length,
      last_page: Math.ceil(data.length / 4),
      data: data,
    }
    return of(response);
  }

  storeProject(project: ProjectData): void {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return;
    }

    const projects = JSON.parse(projectsData);
    projects.push(project);

    this.localStorageSet(projects);
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
