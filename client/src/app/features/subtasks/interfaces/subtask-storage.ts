import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { CreateSubtaskData } from "./create-subtask-data";

export interface SubtaskStorage {
  getSubtasks(projectId: number | string, taskId: number | string, page?: number): Observable<any | null>;
  // getSubtask(projectId: number | string, taskId: number | string, subtaskid: number | string): Observable<any | null>;
  storeSubtask(projectId: number | string, taskId: number | string, subtask: CreateSubtaskData): Observable<any | null>;
  // updateSubtask(projectId: number | string, taskId: number | string, subtask: SubtaskData): Observable<any | null>;
  // removeSubtask(projectId: number | string, ): Observable<any | null>;
  markSubtaskComplete(projectId: number | string, taskId: number | string, subtaskId: number | string): Observable<any | null>;
  markSubtaskIncomplete(projectId: number | string, taskId: number | string, subtaskId: number | string): Observable<any | null>;
}

export const SUBTASK_STORAGE = new InjectionToken<SubtaskStorage>('SubtaskStorage');
