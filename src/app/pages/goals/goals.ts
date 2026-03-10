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

  onGoalSaved() {
    this.loadMyGoals(); // recarga las metas después de crear
  }

  editingGoal: Goal | null = null;

  onEditGoal(goal: Goal) {
    this.editingGoal = goal;
    this.showForm = true;
  }

  activeTab: 'my' | 'partner' | 'shared' = 'my';
  goals: Goal[] = [];
  hasPartner = false;

  constructor(private goalsService: GoalsService) {}

  ngOnInit() {
    this.loadMyGoals();
  }

  loadMyGoals() {
    this.activeTab = 'my';
    this.goalsService.getMyGoals().subscribe({
      next: (response: any) => {
        this.goals = response;
      },
    });
  }

  loadPartnerGoals() {
    this.activeTab = 'partner';
    this.goalsService.getPartnerGoals().subscribe({
      next: (response: any) => {
        this.goals = response;
        this.hasPartner = true;
      },
      error: () => {
        this.hasPartner = false;
        this.goals = [];
      },
    });
  }

  loadSharedGoals() {
    this.activeTab = 'shared';
    this.goalsService.getSharedGoals().subscribe({
      next: (response: any) => {
        this.goals = response;
        this.hasPartner = true;
      },
      error: () => {
        this.hasPartner = false;
        this.goals = [];
      },
    });
  }
}
