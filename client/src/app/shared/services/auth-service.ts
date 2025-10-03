import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { LoginData } from '../../features/login/interfaces/login-data';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  isLoggedIn: WritableSignal<boolean> = signal(false);

  checkIfLoggedIn() {
    this.http.get('api/user').subscribe({
      next: () => this.isLoggedIn.set(true),
      error: () => this.isLoggedIn.set(false)
    });
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

  logout(): void {
    if (!this.isLoggedIn()) {
      return;
    }

    this.http.post('api/logout', {}).subscribe({
      next: () => this.isLoggedIn.set(false),
    });
  }
}
