import { inject, Injectable } from '@angular/core';
import { ProjectStorage } from '../interfaces/project-storage';
import { ProjectData, ProjectDetailData } from '../interfaces/project-data';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { ProjectResponse } from '../interfaces/project-response';
import { Observable, tap } from 'rxjs';
import { CreatedProjectResponse } from '../interfaces/created-project-response';
import { CreateProjectData } from '../interfaces/create-project-data';
import { UpdateProjectData } from '../interfaces/update-project-data';

@Injectable({
  providedIn: 'root',
})
export class ServerProjectStorage implements ProjectStorage {
  private http = inject(HttpClient);

  getProjects(page: number = 1): Observable<PaginatedResponse<ProjectResponse>> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('per_page', 8);
    return this.http.get<PaginatedResponse<ProjectResponse>>('api/projects', {
      params: params,
    });
  }

  getGroupProjects(groupId: number | string, page: number = 1): Observable<PaginatedResponse<ProjectResponse>> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<PaginatedResponse<ProjectResponse>>(`api/groups/${groupId}/projects`, { params: params });
  }

  getProject(id: number): Observable<any> {
    return this.http.get<ProjectDetailData>(`api/projects/${id}`);
  }

  storeProject(project: CreateProjectData): Observable<CreatedProjectResponse> {
    return this.http.post<CreatedProjectResponse>('api/projects', project);
  }

  updateProject(projectId: number | string, project: UpdateProjectData): Observable<any> {
    return this.http.patch(`api/projects/${projectId}`, project);
  }

  removeProject(projectId: number | string): Observable<any> {
    return this.http.delete(`api/projects/${projectId}`);
  }
}
