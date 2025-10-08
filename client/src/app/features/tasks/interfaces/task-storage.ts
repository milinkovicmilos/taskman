import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { CreateTaskData } from "./create-task-data";
import { UpdateTaskData } from "./update-task-data";

export interface TaskStorage {
  getTasks(projectId: number | string, page?: number): Observable<any | null>;
  getTask(projectId: number | string, taskId: number | string): Observable<any | null>;
  storeTask(projectId: number | string, task: CreateTaskData): Observable<any | null>;
  updateTask(projectId: number | string, taskId: number | string, task: UpdateTaskData): Observable<any | null>;
  removeTask(projectId: number | string, taskId: number | string): Observable<any | null>;
  markTaskComplete(projectId: number | string, taskId: number | string): Observable<any | null>;
  markTaskIncomplete(projectId: number | string, taskId: number | string): Observable<any | null>;

  sortOption: number;
}

export const TASK_STORAGE = new InjectionToken<TaskStorage>('TaskStorage');
