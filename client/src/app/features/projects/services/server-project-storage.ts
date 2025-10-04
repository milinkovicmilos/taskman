import { inject, Injectable } from '@angular/core';
import { ProjectStorage } from '../interfaces/project-storage';
import { ProjectData, ProjectDetailData } from '../interfaces/project-data';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<PaginatedResponse<ProjectResponse>>('api/projects', {
      params: params,
    });
  }

  getProject(id: number): Observable<any> {
    return this.http.get<ProjectDetailData>(`api/projects/${id}`);
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
