import { Injectable } from '@angular/core';
import { SubtaskStorage } from '../interfaces/subtask-storage';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { SubtaskData } from '../interfaces/subtask-data';
import { CreateSubtaskData } from '../interfaces/create-subtask-data';
import { CreatedSubtaskResponse } from '../interfaces/created-subtask-response';

@Injectable({
  providedIn: 'root'
})
export class LocalSubtaskStorage implements SubtaskStorage {
  localStorageGet(): string | null {
    return localStorage.getItem("subtasks");
  }

  localStorageSet(value: object | []): void {
    localStorage.setItem("subtasks", JSON.stringify(value));
  }

  constructor() {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      localStorage.setItem("subtasks", "{}");
    }
  }

  getSubtasks(projectId: number | string, taskId: number | string, page: number = 1): Observable<any | null> {
    const subtasksData = this.localStorageGet();
    if (subtasksData == null) {
      return of([]);
    }

    const data = JSON.parse(subtasksData)[taskId];
    if (data == null) {
      return of([]);
    }

    const perPage = 4;
    const offset = perPage * (page - 1);
    const response: PaginatedResponse<SubtaskData> = {
      current_page: page,
      per_page: 4,
      total: data.length,
      last_page: data.length != 0 ? Math.ceil(data.length / perPage) : 1,
      data: data.splice(offset, perPage),
    }
    return of(response);
  }

  storeSubtask(projectId: number | string, taskId: number | string, subtask: CreateSubtaskData): Observable<any | null> {
    const subtasksData = this.localStorageGet();
    if (subtasksData == null) {
      return of([]);
    }

    const subtasks = JSON.parse(subtasksData);
    if (subtasks[projectId] == null) {
      subtasks[projectId] = [];
    }

    const subtaskToStore: SubtaskData = {
      id: crypto.randomUUID(),
      text: subtask.text,
      completed: false,
      completed_at: null,
    }
    subtasks[projectId].push(subtaskToStore);

    this.localStorageSet(subtasks);
    const response: CreatedSubtaskResponse = {
      message: 'Successfully created a task.',
      data: {
        id: subtaskToStore.id,
      }
    }
    return of(response);
  }

  removeSubtasks(taskId: number | string): void {
    const subtasksData = this.localStorageGet();
    if (subtasksData == null) {
      return;
    }

    let subtasks: Record<string, SubtaskData> = JSON.parse(subtasksData);
    if (subtasks[taskId] == null) {
      return;
    }

    delete subtasks[taskId];
    this.localStorageSet(subtasks);
  }
}
