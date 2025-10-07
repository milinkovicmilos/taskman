import { Injectable, inject } from '@angular/core';
import { SubtaskStorage } from '../interfaces/subtask-storage';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateSubtaskData } from '../interfaces/create-subtask-data';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { SubtaskData } from '../interfaces/subtask-data';
import { MessageResponse } from '../../../shared/interfaces/message-response';
import { CreatedSubtaskResponse } from '../interfaces/created-subtask-response';

@Injectable({
  providedIn: 'root'
})
export class ServerSubtaskStorage implements SubtaskStorage {
  private http = inject(HttpClient);

  getSubtasks(projectId: number | string, taskId: number | string, page: number = 1): Observable<PaginatedResponse<SubtaskData>> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<PaginatedResponse<SubtaskData>>(`api/projects/${projectId}/tasks/${taskId}/subtasks`, { params: params });
  }

  storeSubtask(projectId: number | string, taskId: number | string, subtask: CreateSubtaskData): Observable<CreatedSubtaskResponse> {
    return this.http.post<CreatedSubtaskResponse>(`api/projects/${projectId}/tasks/${taskId}/subtasks`, subtask);
  }

  markSubtaskComplete(projectId: number | string, taskId: number | string, subtaskId: number | string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/completed`, {});
  }

  markSubtaskIncomplete(projectId: number | string, taskId: number | string, subtaskId: number | string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/completed`);
  }
}
