import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { CreateTaskData } from "./create-task-data";

export interface TaskStorage {
  getTasks(projectId: number | string, page?: number): Observable<any | null>;
  getTask(projectId: number | string, taskId: number | string): Observable<any | null>;
  storeTask(projectId: number | string, task: CreateTaskData): Observable<any | null>;
  // updateTask(projectId: number | string, project: TaskData): void;
  removeTask(projectId: number | string, taskId: number | string): Observable<any | null>;
}

export const TASK_STORAGE = new InjectionToken<TaskStorage>('TaskStorage');
