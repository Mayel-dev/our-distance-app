import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Goal } from '../../models/goal.model';
import { GoalsService } from '../../services/goals.service';

@Component({
  selector: 'app-goal-card',
  imports: [],
  templateUrl: './goal-card.html',
  styleUrl: './goal-card.css',
})
export class GoalCard implements OnInit {
  @Input() goal!: Goal;
  @Input() currentUserId: string | null = null;

  @Output() goalDeleted = new EventEmitter<void>();
  @Output() goalEdited = new EventEmitter<Goal>();

  constructor(private goalsService: GoalsService) {}

  ngOnInit() {
    console.log('GoalCard debug', {
      title: this.goal.title,
      goalType: this.goal.goalType,
      createdById: this.goal.createdBy?.id,
      partnerId: this.goal.partner?.id,
      currentUserId: this.currentUserId,
      isOwner: this.isOwner,
      isShared: this.isShared,
      isPartner: this.isPartner,
      canEdit: this.canEdit,
      canDelete: this.canDelete,
    });
  }

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
