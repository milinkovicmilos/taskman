import { Injectable } from '@angular/core';
import { TaskStorage } from '../interfaces/task-storage';
import { Observable, of } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { TaskData } from '../interfaces/task-data';
import { CreateTaskData } from '../interfaces/create-task-data';
import { CreatedTaskResponse } from '../interfaces/created-task-response';

@Injectable({
  providedIn: 'root'
})
export class LocalTaskStorage implements TaskStorage {
  localStorageGet(): string | null {
    return localStorage.getItem("tasks");
  }

  localStorageSet(value: object | []): void {
    localStorage.setItem("tasks", JSON.stringify(value));
  }

  constructor() {
    const projectsData = this.localStorageGet();
    if (projectsData == null) {
      localStorage.setItem("tasks", "{}");
    }
  }

  getTasks(projectId: number | string, page: number = 1): Observable<any> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of([]);
    }

    const data = JSON.parse(tasksData)[projectId];
    if (data == null) {
      return of([]);
    }

    const perPage = 4;
    const offset = perPage * (page - 1);
    const response: PaginatedResponse<TaskData> = {
      current_page: page,
      per_page: 4,
      total: data.length,
      last_page: data.length != 0 ? Math.ceil(data.length / perPage) : 1,
      data: data.splice(offset, perPage),
    }
    return of(response);
  }

  getTask(): Observable<any> {
    return of(null);
  }

  storeTask(projectId: number | string, task: CreateTaskData): Observable<any> {
    const tasksData = this.localStorageGet();
    if (tasksData == null) {
      return of(null);
    }

    const tasks = JSON.parse(tasksData);
    if (tasks[projectId] == null) {
      tasks[projectId] = [];
    }

    const taskToStore: TaskData = {
      id: crypto.randomUUID(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.due_date,
      completed: false,
      completed_at: null,
    }
    tasks[projectId].push(taskToStore);

    this.localStorageSet(tasks);
    const data: CreatedTaskResponse = {
      message: 'Successfully created a task.',
      data: {
        id: taskToStore.id,
      }
    }
    return of(data);
  }
}
