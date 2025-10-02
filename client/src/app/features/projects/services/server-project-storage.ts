import { Injectable } from '@angular/core';
import { ProjectStorage } from '../interfaces/project-storage';
import { ProjectData } from '../interfaces/project-data';

@Injectable({
  providedIn: 'root',
})
export class ServerProjectStorage implements ProjectStorage {
  getProjects(): ProjectData[] {
    return [{ id: 1, title: 'from server', description: 'yes' }];
  }

  storeProject(project: ProjectData): void {
    // ...
  }

  updateProject(projectId: number | string, project: ProjectData): void {
    // ...
  }

  removeProject(projectId: number | string): void {
    // ...
  }
}
