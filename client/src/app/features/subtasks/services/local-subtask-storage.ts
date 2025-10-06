import { Injectable } from '@angular/core';
import { SubtaskStorage } from '../interfaces/subtask-storage';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { SubtaskData } from '../interfaces/subtask-data';

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
}
