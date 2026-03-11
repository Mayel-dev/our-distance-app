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

  // Helper method to avoid code duplication when fetching goals for different tabs
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
   
  // Method to switch between tabs and load corresponding goals
  setTab(tab: 'my' | 'partner' | 'shared') {
    this.activeTab = tab;

    if (tab === 'my') {
      this.loadMyGoals();
    }

    if (tab === 'partner') {
      this.loadPartnerGoals();
    }

    if (tab === 'shared') {
      this.loadSharedGoals();
    }
  }

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

  // Tab loading methods
  loadMyGoals() {
    this.fetchGoals(this.goalsService.getMyGoals(), 'my');
  }

  loadPartnerGoals() {
    this.fetchGoals(this.goalsService.getPartnerGoals(), 'partner');
  }

  loadSharedGoals() {
    this.fetchGoals(this.goalsService.getSharedGoals(), 'shared');
  }
}
