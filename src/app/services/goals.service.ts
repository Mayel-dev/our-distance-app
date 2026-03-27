import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Goal } from '../models/goal.model';

type GoalType = 'PRIVATE' | 'SHARED';
type GoalCategory = 'HEALTH' | 'FINANCE' | 'LEARNING' | 'TRAVEL' | 'FITNESS' | 'OTHER';

export interface CreateGoalPayload {
  title: string;
  description?: string;
  goalType: GoalType;
  categoryIcon?: string;
  category?: GoalCategory;
  progress?: number;
  targetDate?: string;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  status?: Goal['status'];
  goalType?: GoalType;
  categoryIcon?: string;
  category?: GoalCategory;
  progress?: number;
  targetDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private readonly apiUrl = 'https://our-distance-production-35d4.up.railway.app';
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // TODO: Move this to a separate AuthInterceptor
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getMyGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/my-goals`, {
      headers: this.getHeaders(),
    });
  }

  getPartnerGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/partner-goals`, {
      headers: this.getHeaders(),
    });
  }

  getSharedGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/shared-goals`, {
      headers: this.getHeaders(),
    });
  }

  createGoal(data: CreateGoalPayload): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteGoal(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/goals/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateGoal(id: string, data: UpdateGoalPayload): Observable<Goal> {
    return this.http.patch<Goal>(`${this.apiUrl}/goals/${id}`, data, {
      headers: this.getHeaders(),
    });
  }
}
