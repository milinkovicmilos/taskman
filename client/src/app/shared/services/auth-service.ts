import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { LoginData } from '../../features/login/interfaces/login-data';
import { firstValueFrom, Observable, pipe, switchMap, tap } from 'rxjs';
import { RegisterData } from '../../features/register/interfaces/register-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  isLoggedIn: WritableSignal<boolean> = signal(false);

  register(data: RegisterData) {
    return this.http.post('api/register', data).pipe(
      tap(() => this.isLoggedIn.set(true))
    );
  }

  async checkIfLoggedIn(): Promise<void> {
    return firstValueFrom(this.http.get('api/user'))
      .then(() => this.isLoggedIn.set(true))
      .catch(() => this.isLoggedIn.set(false));
  }

  login(data: LoginData): Observable<any> {
    return this.http.get('sanctum/csrf-cookie').pipe(
      switchMap(() =>
        this.http.post<LoginData>('api/login', data).pipe(
          tap(() => this.isLoggedIn.set(true))
        )
      )
    );
  }

  logout(): Observable<any> {
    return this.http.post('api/logout', {}).pipe(
      tap(() => this.isLoggedIn.set(false))
    )
  }
}
