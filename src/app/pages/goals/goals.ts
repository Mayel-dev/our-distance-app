import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { Navbar } from '../../components/navbar/navbar';
import { GoalsService } from '../../services/goals.service';
import { AuthService } from '../../services/auth.service';
import { Goal } from '../../models/goal.model';
import { User } from '../../models/user.model';
import { GoalCard } from '../../components/goal-card/goal-card';
import { GoalForm } from '../../components/goal-form/goal-form';

type GoalTab = 'my' | 'partner' | 'shared';
type GoalStatus = Goal['status'];

interface GoalColumn {
  status: GoalStatus;
  title: string;
  emptyText: string;
  cssClass: 'pending' | 'in-progress' | 'completed';
}

const GOALS_ACTIVE_TAB_KEY = 'goalsActiveTab';

@Component({
  selector: 'app-goals',
  imports: [Navbar, GoalCard, RouterLink, GoalForm],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
})
export class Goals implements OnInit {
  private readonly goalsService = inject(GoalsService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tabs: ReadonlyArray<{ key: GoalTab; label: string }> = [
    { key: 'my', label: 'Mis metas' },
    { key: 'partner', label: 'Metas de mi pareja' },
    { key: 'shared', label: 'Metas compartidas' },
  ];

  readonly statusColumns: ReadonlyArray<GoalColumn> = [
    {
      status: 'PENDING',
      title: '⏳ Pendiente',
      emptyText: 'Sin metas pendientes 🎯',
      cssClass: 'pending',
    },
    {
      status: 'IN_PROGRESS',
      title: '🔄 En progreso',
      emptyText: 'Sin metas en progreso 🔄',
      cssClass: 'in-progress',
    },
    {
      status: 'COMPLETED',
      title: '✅ Completado',
      emptyText: 'Sin metas completadas ✅',
      cssClass: 'completed',
    },
  ];

  readonly showForm = signal(false);
  readonly editingGoal = signal<Goal | null>(null);
  readonly activeTab = signal<GoalTab>('my');
  readonly goals = signal<Goal[]>([]);
  readonly hasPartner = signal(false);
  readonly loading = signal(false);
  readonly currentUserId = signal<string | null>(null);

  readonly canCreateGoal = computed(() => {
    const tab = this.activeTab();
    return tab === 'my' || tab === 'shared';
  });

  readonly goalsByStatus = computed<Record<GoalStatus, Goal[]>>(() => {
    const goals = this.goals();

    return {
      PENDING: goals.filter((goal) => goal.status === 'PENDING'),
      IN_PROGRESS: goals.filter((goal) => goal.status === 'IN_PROGRESS'),
      COMPLETED: goals.filter((goal) => goal.status === 'COMPLETED'),
    };
  });

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadSavedTab();
    this.loadGoalsByActiveTab();
  }

  setTab(tab: GoalTab): void {
    this.activeTab.set(tab);
    localStorage.setItem(GOALS_ACTIVE_TAB_KEY, tab);

    this.closeForm();
    this.loadGoalsByActiveTab();
  }

  onGoalSaved(): void {
    this.closeForm();
    this.loadGoalsByActiveTab();
  }

  onEditGoal(goal: Goal): void {
    this.editingGoal.set(goal);
    this.showForm.set(true);
  }

  openCreateForm(): void {
    this.editingGoal.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingGoal.set(null);
  }

  getGoalsForStatus(status: GoalStatus): Goal[] {
    return this.goalsByStatus()[status];
  }

  private fetchGoals(request$: Observable<Goal[]>, tab: GoalTab): void {
    this.loading.set(true);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.goals.set(response);

          if (tab !== 'my') {
            this.hasPartner.set(true);
          }
        },
        error: (_error: HttpErrorResponse) => {
          if (tab !== 'my') {
            this.hasPartner.set(false);
          }

          this.goals.set([]);
        },
      });
  }

  private getGoalsRequest(tab: GoalTab): Observable<Goal[]> {
    switch (tab) {
      case 'my':
        return this.goalsService.getMyGoals() as Observable<Goal[]>;
      case 'partner':
        return this.goalsService.getPartnerGoals() as Observable<Goal[]>;
      case 'shared':
        return this.goalsService.getSharedGoals() as Observable<Goal[]>;
    }
  }

  private loadCurrentUser(): void {
    (this.authService.getMe() as Observable<User>)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.currentUserId.set(user.id);
          this.hasPartner.set(Boolean(user.partner));
        },
        error: (err: unknown) => {
          console.error('Error loading current user', err);
        },
      });
  }

  private loadSavedTab(): void {
    const savedTab = localStorage.getItem(GOALS_ACTIVE_TAB_KEY);

    if (savedTab === 'my' || savedTab === 'partner' || savedTab === 'shared') {
      this.activeTab.set(savedTab);
      return;
    }

    this.activeTab.set('my');
  }

  private loadGoalsByActiveTab(): void {
    const currentTab = this.activeTab();
    this.fetchGoals(this.getGoalsRequest(currentTab), currentTab);
  }
}
