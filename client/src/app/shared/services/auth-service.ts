import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginData } from '../../features/login/interfaces/login-data';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // To be changed
  isLoggedIn: boolean = false;

  private http = inject(HttpClient);

  login(data: LoginData): Observable<any> {
    return this.http.get('sanctum/csrf-cookie').pipe(
      switchMap(() =>
        this.http.post<LoginData>('api/login', data)
      )
    );
  }
}
