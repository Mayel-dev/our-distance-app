import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // Nombres de metodos no importa
  register(data: { username: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  getMe() {
    return this.http.get(`${this.apiUrl}/users/me`, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Pairing method
  connectPartner(pairingCode: string) {
    return this.http.post(
      `${this.apiUrl}/users/connect-partner`,
      { pairingCode },
      { headers: this.getHeaders() },
    );
  }

  // Unpairing method
  disconnectPartner() {
    return this.http.patch(
      `${this.apiUrl}/users/disconnect-partner`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }

  // editar perfil
  updateMe(data: { username?: string; password?: string }) {
    return this.http.patch(`${this.apiUrl}/users/me`, data, {
      headers: this.getHeaders(),
    });
  }

  // eliminar perfil
  deleteMe() {
    return this.http.delete(`${this.apiUrl}/users/me`, {
      headers: this.getHeaders(),
    });
  }
}
