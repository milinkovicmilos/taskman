import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { LoginData } from '../../features/login/interfaces/login-data';
import { firstValueFrom, Observable, switchMap, tap } from 'rxjs';
import { RegisterData } from '../../features/register/interfaces/register-data';
import { UserResponse } from '../interfaces/user-response';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  isLoggedIn: WritableSignal<boolean> = signal(false);
  data: WritableSignal<User> = signal({ firstName: '', lastName: '', email: '' });

  register(data: RegisterData) {
    return this.http.post<UserResponse>('api/register', data).pipe(
      tap((response) => {
        this.isLoggedIn.set(true)
        const { first_name, last_name, email } = response.data;
        this.data.set({ firstName: first_name, lastName: last_name, email: email });
      })
    );
  }

  async checkIfLoggedIn(): Promise<void> {
    return firstValueFrom(this.http.get<UserResponse>('api/user'))
      .then((response: UserResponse) => {
        this.isLoggedIn.set(true)
        const { first_name, last_name, email } = response.data;
        this.data.set({ firstName: first_name, lastName: last_name, email: email });
      })
      .catch(() => {
        this.isLoggedIn.set(false)
        this.data.set({ firstName: '', lastName: '', email: '' });
      });
  }

  login(data: LoginData): Observable<any> {
    return this.http.get('sanctum/csrf-cookie').pipe(
      switchMap(() =>
        this.http.post<UserResponse>('api/login', data).pipe(
          tap((response) => {
            this.isLoggedIn.set(true)
            const { first_name, last_name, email } = response.data;
            this.data.set({ firstName: first_name, lastName: last_name, email: email });
          })
        )
      )
    );
  }

  logout(): Observable<any> {
    return this.http.post('api/logout', {}).pipe(
      tap(() => {
        this.isLoggedIn.set(false);
        this.data.set({ firstName: '', lastName: '', email: '' });
      })
    )
  }
}
