import { InjectionToken } from "@angular/core";
import { ProjectData } from "./project-data";

export interface ProjectStorage {
  getProjects(): ProjectData[];
  storeProject(project: ProjectData): void;
  updateProject(projectId: number | string, project: ProjectData): void;
  removeProject(projectId: number | string): void;
}

export const PROJECT_STORAGE = new InjectionToken<ProjectStorage>('ProjectStorage');
