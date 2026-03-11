import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { GoalsService } from '../../services/goals.service';
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

  constructor(private goalsService: GoalsService) {}

  ngOnInit() {
    this.loadMyGoals();
  }

  onGoalSaved() {
    this.showForm = false;
    this.editingGoal = null;

    if (this.activeTab === 'my') {
      this.loadMyGoals();
    } else if (this.activeTab === 'partner') {
      this.loadPartnerGoals();
    } else if (this.activeTab === 'shared') {
      this.loadSharedGoals();
    }
  }

  onEditGoal(goal: Goal) {
    this.editingGoal = goal;
    this.showForm = true;
  }

  loadMyGoals() {
    this.activeTab = 'my';
    this.loading = true;

    this.goalsService.getMyGoals().subscribe({
      next: (response: any) => {
        this.goals = response;
        this.loading = false;
      },
      error: () => {
        this.goals = [];
        this.loading = false;
      },
    });
  }

  loadPartnerGoals() {
    this.activeTab = 'partner';
    this.loading = true;

    this.goalsService.getPartnerGoals().subscribe({
      next: (response: any) => {
        this.goals = response;
        this.hasPartner = true;
        this.loading = false;
      },
      error: () => {
        this.hasPartner = false;
        this.goals = [];
        this.loading = false;
      },
    });
  }

  loadSharedGoals() {
    this.activeTab = 'shared';
    this.loading = true;

    this.goalsService.getSharedGoals().subscribe({
      next: (response: any) => {
        this.goals = response;
        this.hasPartner = true;
        this.loading = false;
      },
      error: () => {
        this.hasPartner = false;
        this.goals = [];
        this.loading = false;
      },
    });
  }
}
