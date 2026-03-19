import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Goal } from '../../models/goal.model';
import { GoalsService } from '../../services/goals.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-goal-card',
  imports: [DatePipe],
  templateUrl: './goal-card.html',
  styleUrl: './goal-card.css',
})
export class GoalCard {
  @Input() goal!: Goal;
  @Input() currentUserId: string | null = null;

  @Output() goalDeleted = new EventEmitter<void>();
  @Output() goalEdited = new EventEmitter<Goal>();

  constructor(private goalsService: GoalsService) {}



  get isOwner(): boolean {
    return this.goal.createdBy.id === this.currentUserId;
  }

  get isShared(): boolean {
    return this.goal.goalType === 'SHARED';
  }

  get isPartner(): boolean {
    return this.goal.partner?.id === this.currentUserId;
  }

  get canEdit(): boolean {
    return this.isOwner || (this.isShared && this.isPartner);
  }

  get canDelete(): boolean {
    return this.isOwner;
  }

  onDelete() {
    if (!this.canDelete) return;

    this.goalsService.deleteGoal(this.goal.id).subscribe({
      next: () => this.goalDeleted.emit(),
      error: (err) => {
        console.error('Error deleting goal', err);
      },
    });
  }

  onEdit() {
    if (!this.canEdit) return;

    this.goalEdited.emit(this.goal);
  }
}
