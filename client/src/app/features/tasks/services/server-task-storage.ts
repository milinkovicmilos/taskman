import { Injectable, inject } from '@angular/core';
import { TaskStorage } from '../interfaces/task-storage';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response';
import { TaskData, TaskDetailData } from '../interfaces/task-data';
import { CreateTaskData } from '../interfaces/create-task-data';
import { UpdateTaskData } from '../interfaces/update-task-data';
import { CreatedTaskResponse } from '../interfaces/created-task-response';
import { MessageResponse } from '../../../shared/interfaces/message-response';

@Injectable({
  providedIn: 'root'
})
export class ServerTaskStorage implements TaskStorage {
  private http = inject(HttpClient);

  getTasks(projectId: number | string, page: number = 1): Observable<PaginatedResponse<TaskData>> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get<PaginatedResponse<TaskData>>(`api/projects/${projectId}/tasks`, { params: params });
  }

  getTask(projectId: number | string, taskId: number | string): Observable<TaskDetailData> {
    return this.http.get<TaskDetailData>(`api/projects/${projectId}/tasks/${taskId}`);
  }

  storeTask(projectId: number | string, task: CreateTaskData): Observable<CreatedTaskResponse> {
    return this.http.post<CreatedTaskResponse>(`api/projects/${projectId}/tasks`, task);
  }

  updateTask(projectId: number | string, taskId: number | string, task: UpdateTaskData): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`api/projects/${projectId}/tasks/${taskId}`, task);
  }

  removeTask(projectId: number | string, taskId: number | string): Observable<any | null> {
    return this.http.delete<MessageResponse>(`api/projects/${projectId}/tasks/${taskId}`);
  }
}
