import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { GoalsService } from '../../services/goals.service';
import { AuthService } from '../../services/auth.service';
import { Goal } from '../../models/goal.model';
import { CommonModule } from '@angular/common';
import { GoalCard } from '../../components/goal-card/goal-card';
import { GoalForm } from '../../components/goal-form/goal-form';

@Component({
  selector: 'app-goals',
  imports: [Navbar, CommonModule, GoalCard, RouterLink, GoalForm],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
})
export class Goals implements OnInit {
  showForm = false;
  editingGoal: Goal | null = null;

  activeTab: 'my' | 'partner' | 'shared' = 'my';
  goals: Goal[] = [];
  hasPartner = false;
  loading = false;

  currentUserId: string | null = null;

  constructor(
    private goalsService: GoalsService,
    private authService: AuthService,
  ) {}

  private fetchGoals(request: any, tab: 'my' | 'partner' | 'shared') {
    this.loading = true;

    request.subscribe({
      next: (response: any) => {
        this.goals = response;
        this.hasPartner = true;
        this.loading = false;
      },
      error: () => {
        if (tab !== 'my') {
          this.hasPartner = false;
        }
        this.goals = [];
        this.loading = false;
      },
    });
  }

  private loadCurrentUser() {
    this.authService.getMe().subscribe({
      next: (user: any) => {
        this.currentUserId = user.id;
      },
      error: (err) => {
        console.error('Error loading current user', err);
      },
    });
  }

  private loadSavedTab() {
    const savedTab = localStorage.getItem('goalsActiveTab');

    if (savedTab === 'my' || savedTab === 'partner' || savedTab === 'shared') {
      this.activeTab = savedTab;
    } else {
      this.activeTab = 'my';
    }
  }

  private loadGoalsByActiveTab() {
    if (this.activeTab === 'my') {
      this.loadMyGoals();
    }

    if (this.activeTab === 'partner') {
      this.loadPartnerGoals();
    }

    if (this.activeTab === 'shared') {
      this.loadSharedGoals();
    }
  }

  setTab(tab: 'my' | 'partner' | 'shared') {
    this.activeTab = tab;
    localStorage.setItem('goalsActiveTab', tab);

    this.showForm = false;
    this.editingGoal = null;

    this.loadGoalsByActiveTab();
  }

  ngOnInit() {
    this.loadCurrentUser();
    this.loadSavedTab();
    this.loadGoalsByActiveTab();
  }

  onGoalSaved() {
    this.showForm = false;
    this.editingGoal = null;
    this.loadGoalsByActiveTab();
  }

  onEditGoal(goal: Goal) {
    this.editingGoal = goal;
    this.showForm = true;
  }

  openCreateForm() {
    this.editingGoal = null;
    this.showForm = true;
  }

  loadMyGoals() {
    this.fetchGoals(this.goalsService.getMyGoals(), 'my');
  }

  loadPartnerGoals() {
    this.fetchGoals(this.goalsService.getPartnerGoals(), 'partner');
  }

  loadSharedGoals() {
    this.fetchGoals(this.goalsService.getSharedGoals(), 'shared');
  }

  get pendingGoals(): Goal[] {
    return this.goals.filter(g => g.status === 'PENDING');
  }

  get inProgressGoals(): Goal[] {
    return this.goals.filter(g => g.status === 'IN_PROGRESS');
  }

  get completedGoals(): Goal[] {
    return this.goals.filter(g => g.status === 'COMPLETED');
  }
}
