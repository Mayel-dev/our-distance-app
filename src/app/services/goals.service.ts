import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private apiUrl = 'https://our-distance-production-35d4.up.railway.app';
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getMyGoals() {
    return this.http.get(`${this.apiUrl}/goals/my-goals`, {
      headers: this.getHeaders(),
    });
  }

  getPartnerGoals() {
    return this.http.get(`${this.apiUrl}/goals/partner-goals`, {
      headers: this.getHeaders(),
    });
  }

  getSharedGoals() {
    return this.http.get(`${this.apiUrl}/goals/shared-goals`, {
      headers: this.getHeaders(),
    });
  }

  createGoal(data: {
    title: string;
    description?: string;
    goalType: 'PRIVATE' | 'SHARED';
    categoryIcon?: string;
    category?: 'HEALTH' | 'FINANCE' | 'LEARNING' | 'TRAVEL' | 'FITNESS' | 'OTHER';
    progress?: number;
    targetDate?: string;
  }) {
    return this.http.post(`${this.apiUrl}/goals`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteGoal(id: string) {
    return this.http.delete(`${this.apiUrl}/goals/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateGoal(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      goalType?: string;
      categoryIcon?: string;
      category?: 'HEALTH' | 'FINANCE' | 'LEARNING' | 'TRAVEL' | 'FITNESS' | 'OTHER';
      progress?: number;
      targetDate?: string;
    },
  ) {
    return this.http.patch(`${this.apiUrl}/goals/${id}`, data, {
      headers: this.getHeaders(),
    });
  }
}
