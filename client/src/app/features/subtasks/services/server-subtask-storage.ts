import { Injectable, inject } from '@angular/core';
import { SubtaskStorage } from '../interfaces/subtask-storage';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerSubtaskStorage implements SubtaskStorage {
  private http = inject(HttpClient);

  getSubtasks(projectId: number | string, taskId: number | string, page: number = 1): Observable<any | null> {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get(`api/projects/${projectId}/tasks/${taskId}/subtasks`, { params: params });
  }
}
