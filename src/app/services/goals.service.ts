import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal } from '../models/goal.model';
import { environment } from '../../environments/environment';

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
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getMyGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/my-goals`);
  }

  getPartnerGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/partner-goals`);
  }

  getSharedGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/shared-goals`);
  }

  createGoal(data: CreateGoalPayload): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, data);
  }

  deleteGoal(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/goals/${id}`);
  }

  updateGoal(id: string, data: UpdateGoalPayload): Observable<Goal> {
    return this.http.patch<Goal>(`${this.apiUrl}/goals/${id}`, data);
  }
}
