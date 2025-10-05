import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { CreateProjectData } from "./create-project-data";
import { UpdateProjectData } from "./update-project-data";

export interface ProjectStorage {
  getProjects(page?: number): Observable<any | null>;
  getProject(projectId: number | string): Observable<any | null>;
  storeProject(project: CreateProjectData): Observable<any | null>;
  updateProject(projectId: number | string, project: UpdateProjectData): Observable<any>;
  removeProject(projectId: number | string): Observable<any>;
}

export const PROJECT_STORAGE = new InjectionToken<ProjectStorage>('ProjectStorage');
