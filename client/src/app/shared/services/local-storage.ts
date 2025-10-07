import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorage {
  write(data: StorageData): void {
    localStorage.setItem('projects', JSON.stringify(data['projects']));
    localStorage.setItem('tasks', JSON.stringify(data['tasks']));
    localStorage.setItem('subtasks', JSON.stringify(data['subtasks']));
  }

  fetch(): string {
    return JSON.stringify({
      projects: JSON.parse(localStorage.getItem('projects') ?? "[]"),
      tasks: JSON.parse(localStorage.getItem('tasks') ?? "{}"),
      subtasks: JSON.parse(localStorage.getItem('subtasks') ?? "{}"),
    });
  }
}

interface StorageData {
  projects: [];
  tasks: {};
  subtasks: {};
}
