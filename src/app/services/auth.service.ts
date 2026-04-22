import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  catchError,
  finalize,
  map,
  of,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface UpdateMePayload {
  username?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private refreshRequest$: Observable<AuthResponse> | null = null;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  register(data: { username: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data);
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.http
        .post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken })
        .pipe(
          tap((response) => this.saveSession(response)),
          shareReplay(1),
          finalize(() => {
            this.refreshRequest$ = null;
          }),
        );
    }

    return this.refreshRequest$.pipe(map((response) => response.access_token));
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`);
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isLoggedIn(): boolean {
    return !!(this.getToken() || this.getRefreshToken());
  }

  logout(): void {
    if (!this.isLoggedIn()) {
      this.clearSession();
      return;
    }

    this.http
      .post<{ message: string }>(`${this.apiUrl}/auth/logout`, {})
      .pipe(
        catchError(() => of({ message: 'Sesion cerrada localmente' })),
        finalize(() => this.clearSession()),
      )
      .subscribe();
  }

  clearSession(redirect = true): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');

    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  connectPartner(pairingCode: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/users/connect-partner`, {
      pairingCode,
    });
  }

  disconnectPartner(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/disconnect-partner`);
  }

  updateMe(data: UpdateMePayload): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/me`, data);
  }

  changePassword(data: ChangePasswordPayload): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/users/me/password`, data);
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.apiUrl}/users/forgot-password`, {
      email,
    });
  }

  resetPassword(data: {
    token: string;
    newPassword: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/users/reset-password`, data);
  }

  deleteMe(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/me`);
  }
}
