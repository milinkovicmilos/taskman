import { InjectionToken } from "@angular/core";
import { ProjectData } from "./project-data";
import { Observable } from "rxjs";
import { CreateProjectData } from "./create-project-data";

export interface ProjectStorage {
  getProjects(page?: number): Observable<any | null>;
  getProject(projectId: number | string): Observable<any | null>;
  storeProject(project: CreateProjectData): Observable<any | null>;
  updateProject(projectId: number | string, project: ProjectData): void;
  removeProject(projectId: number | string): void;
}

export const PROJECT_STORAGE = new InjectionToken<ProjectStorage>('ProjectStorage');
