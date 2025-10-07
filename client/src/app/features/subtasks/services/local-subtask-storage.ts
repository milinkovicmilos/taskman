import { Injectable } from '@angular/core';
import { SubtaskStorage } from '../interfaces/subtask-storage';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { SubtaskData } from '../interfaces/subtask-data';
import { CreateSubtaskData } from '../interfaces/create-subtask-data';
import { CreatedSubtaskResponse } from '../interfaces/created-subtask-response';
import { MessageResponse } from '../../../shared/interfaces/message-response';

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
    if (subtasks[taskId] == null) {
      subtasks[taskId] = [];
    }

    const subtaskToStore: SubtaskData = {
      id: crypto.randomUUID(),
      text: subtask.text,
      completed: false,
      completed_at: null,
    }
    subtasks[taskId].push(subtaskToStore);

    this.localStorageSet(subtasks);
    const response: CreatedSubtaskResponse = {
      message: 'Successfully created a subtask.',
      data: {
        id: subtaskToStore.id,
      }
    }
    return of(response);
  }

  markSubtaskComplete(projectId: number | string, taskId: number | string, subtaskId: number | string): Observable<any | null> {
    const subtasksData = this.localStorageGet();
    if (subtasksData == null) {
      return of(null);
    }

    const subtasksObj = JSON.parse(subtasksData);
    if (subtasksObj[taskId] == null) {
      return of(null);
    }

    const tasksSubtasks: SubtaskData[] = subtasksObj[taskId];
    if (tasksSubtasks == null) {
      return of(null);
    }

    const now = new Date();
    tasksSubtasks.map(x => {
      if (x.id === subtaskId) {
        x.completed = true;
        x.completed_at = now.toISOString().split('T')[0];
      }
    });

    this.localStorageSet(subtasksObj);
    const response: MessageResponse = {
      message: 'Successfully marked subtask as complete.'
    };
    return of(response);
  }

  markSubtaskIncomplete(projectId: number | string, taskId: number | string, subtaskId: number | string): Observable<any | null> {
    const subtasksData = this.localStorageGet();
    if (subtasksData == null) {
      return of(null);
    }

    const subtasksObj = JSON.parse(subtasksData);
    if (subtasksObj[taskId] == null) {
      return of(null);
    }

    const tasksSubtasks: SubtaskData[] = subtasksObj[taskId];
    if (tasksSubtasks == null) {
      return of(null);
    }

    tasksSubtasks.map(x => {
      if (x.id === subtaskId) {
        x.completed = false;
        x.completed_at = null;
      }
    });

    this.localStorageSet(subtasksObj);
    const response: MessageResponse = {
      message: 'Successfully marked subtask as incomplete.'
    };
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
