import { Injectable, inject } from '@angular/core';
import { ProjectStorage } from '../interfaces/project-storage';
import { ProjectData, ProjectDetailData } from '../interfaces/project-data';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { ProjectResponse } from '../interfaces/project-response';
import { CreatedProjectResponse } from '../interfaces/created-project-response';
import { CreateProjectData } from '../interfaces/create-project-data';
import { UpdateProjectData } from '../interfaces/update-project-data';
import { UpdatedProjectResponse } from '../interfaces/updated-project-response';
import { DeletedProjectResponse } from '../interfaces/deleted-project-response';
import { LocalTaskStorage } from '../../tasks/services/local-task-storage';
import { GroupRole } from '../../groups/enums/group-role';

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
      last_page: data.length != 0 ? Math.ceil(data.length / perPage) : 1,
      data: data.splice(offset, perPage),
    }
    return of(response);
  }

  getProject(id: number | string): Observable<any> {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return of(null);
    }

    const projects: ProjectDetailData[] = JSON.parse(projectsData);
    let project = projects.find(x => x.id === id);
    if (project == null) {
      return of(null);
    }

    project.role = GroupRole.Owner;
    return of(project);
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

  updateProject(projectId: number | string, project: UpdateProjectData): Observable<any> {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return of(null);
    }

    const projects: ProjectData[] = JSON.parse(projectsData);
    const projectToUpdate = projects.find(x => x.id === projectId);
    if (projectToUpdate == null) {
      return of(null);
    }

    projects.map(x => {
      if (x.id === projectId) {
        x.name = project.name;
        x.description = project.description;
      }
    })

    this.localStorageSet(projects);
    const response: UpdatedProjectResponse = {
      message: 'Successfully updated the projects name.'
    };
    return of(response);
  }

  removeProject(projectId: number | string): Observable<any> {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return of(null);
    }

    const tmpProjects: ProjectData[] = JSON.parse(projectsData);
    const projects = tmpProjects.filter(x => x.id != projectId);

    const taskStorage = new LocalTaskStorage();
    taskStorage.removeTasks(projectId);

    this.localStorageSet(projects);
    const response: DeletedProjectResponse = {
      message: 'Successfully deleted the project.',
    };
    return of(response);
  }
}
