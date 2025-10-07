import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUsersResponse } from '../interfaces/get-users-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUsers(search: string): Observable<GetUsersResponse> {
    let params = new HttpParams();
    params = params.append('search', search);
    return this.http.get<GetUsersResponse>('api/users', { params: params });
  }
}
