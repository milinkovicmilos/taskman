import { Injectable } from '@angular/core';
import { TaskStorage } from '../interfaces/task-storage';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalTaskStorage implements TaskStorage {
  getTasks(): Observable<any> {
    return of(null);
  }

  getTask(): Observable<any> {
    return of(null);
  }
}
