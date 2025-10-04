import { inject, Injectable } from '@angular/core';
import { ProjectStorage } from '../interfaces/project-storage';
import { ProjectData } from '../interfaces/project-data';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { ProjectResponse } from '../interfaces/project-response';
import { Observable, tap } from 'rxjs';
import { CreatedProjectResponse } from '../interfaces/created-project-response';

@Injectable({
  providedIn: 'root',
})
export class ServerProjectStorage implements ProjectStorage {
  private http = inject(HttpClient);

  getProjects(page: number = 1): Observable<PaginatedResponse<ProjectResponse>> {
    return this.http.get<PaginatedResponse<ProjectResponse>>('api/projects');
  }

  storeProject(project: ProjectData): Observable<CreatedProjectResponse> {
    return this.http.post<CreatedProjectResponse>('api/projects', project);
  }

  updateProject(projectId: number | string, project: ProjectData): void {
    // ...
  }

  removeProject(projectId: number | string): void {
    // ...
  }
}
