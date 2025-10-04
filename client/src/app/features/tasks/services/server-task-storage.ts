import { Injectable, inject } from '@angular/core';
import { TaskStorage } from '../interfaces/task-storage';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerTaskStorage implements TaskStorage {
  private http = inject(HttpClient);

  getTasks(projectId: number | string, page: number = 1) {
    let params = new HttpParams();
    params = params.append('page', page);
    return this.http.get(`api/projects/${projectId}/tasks`, { params: params });
  }

  getTask(projectId: number | string, taskId: number | string): Observable<any> {
    return this.http.get(`api/projects/${projectId}/${taskId}`);
  }
}
