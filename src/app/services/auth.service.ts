import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface UpdateMePayload {
  username?: string;
  password?: string;
  currentPassword?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://our-distance-production-35d4.up.railway.app';

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  register(data: { username: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  connectPartner(pairingCode: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/users/connect-partner`,
      { pairingCode },
      { headers: this.getHeaders() },
    );
  }

  disconnectPartner(): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.apiUrl}/users/disconnect-partner`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }

  updateMe(data: UpdateMePayload): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/me`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteMe(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/me`, {
      headers: this.getHeaders(),
    });
  }
}
