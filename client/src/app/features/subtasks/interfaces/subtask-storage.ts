import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export interface TaskStorage {
  getSubtasks(projectId: number | string, taskId: number | string, page?: number): Observable<any | null>;
  // getSubtask(projectId: number | string, taskId: number | string, subtaskid: number | string): Observable<any | null>;
  // storeSubtask(projectId: number | string, taskId: number | string, subtask: CreateSubtaskData): Observable<any | null>;
  // updateSubtask(projectId: number | string, taskId: number | string, subtask: SubtaskData): Observable<any | null>;
  // removeSubtask(projectId: number | string, ): Observable<any | null>;
}

export const SUBTASK_STORAGE = new InjectionToken<TaskStorage>('SubtaskStorage');
