import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Goal } from '../../models/goal.model';
import { GoalsService } from '../../services/goals.service';

@Component({
  selector: 'app-goal-card',
  imports: [],
  templateUrl: './goal-card.html',
  styleUrl: './goal-card.css',
})
export class GoalCard {
  @Input() goal!: Goal;
  @Output() goalDeleted = new EventEmitter<void>();
  @Output() goalEdited = new EventEmitter<Goal>();

  constructor(private goalsService: GoalsService) {}

  onDelete() {
    this.goalsService.deleteGoal(this.goal.id).subscribe({
      next: () => this.goalDeleted.emit(),
    });
  }

  onEdit() {
    this.goalEdited.emit(this.goal);
  }
}
