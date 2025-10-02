import { Injectable } from '@angular/core';
import { ProjectStorage } from '../interfaces/project-storage';
import { ProjectData } from '../interfaces/project-data';

@Injectable({
  providedIn: 'root',
})
export class LocalProjectStorage implements ProjectStorage {
  localStorageGet(): string | null {
    return localStorage.getItem("projects");
  }

  constructor() {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      localStorage.setItem("projects", "[]");
    }
  }

  getProjects(): ProjectData[] {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return [];
    }

    console.log(JSON.parse(projectsData))
    return JSON.parse(projectsData);
  }

  storeProject(project: ProjectData): void {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      return;
    }

    const projects = JSON.parse(projectsData);
    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  updateProject(projectId: number | string, project: ProjectData): void {

  }

  removeProject(projectId: number | string): void {

  }
}
