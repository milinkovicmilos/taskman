import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export interface TaskStorage {
  getTasks(page?: number): Observable<any | null>;
  getTask(taskId: number | string): Observable<any | null>;
  // storeTasks(project: CreateTaskData): Observable<any | null>;
  // updateTask(projectId: number | string, project: TaskData): void;
  // removeTask(projectId: number | string): void;
}

export const TASK_STORAGE = new InjectionToken<TaskStorage>('TaskStorage');
