import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoalsService } from '../../services/goals.service';
import { Goal } from '../../models/goal.model';

@Component({
  selector: 'goal-form',
  imports: [FormsModule],
  templateUrl: './goal-form.html',
  styleUrl: './goal-form.css',
})
export class GoalForm implements OnInit {
  @Input() isEditing = false;
  @Input() goal: Goal | null = null;
  @Input() hasPartner = false;
  @Input() currentUserId: string | null = null;

  @Output() formClosed = new EventEmitter<void>();
  @Output() goalSaved = new EventEmitter<void>();

  title = '';
  description = '';
  goalType = 'PRIVATE';
  status = 'PENDING';

  constructor(private goalsService: GoalsService) {}

  ngOnInit() {
    if (!this.goal) return;

    this.title = this.goal.title;
    this.description = this.goal.description || '';
    this.goalType = this.goal.goalType;
    this.status = this.goal.status;
  }

  get canEditGoalType(): boolean {
    if (!this.isEditing || !this.goal) return true;
    return this.goal.createdBy.id === this.currentUserId;
  }

  private handleSuccess() {
    this.goalSaved.emit();
    this.formClosed.emit();
  }

  submit() {
    if (this.isEditing && this.goal) {
      const updateData: {
        title?: string;
        description?: string;
        status?: string;
        goalType?: string;
      } = {
        title: this.title,
        description: this.description,
        status: this.status,
      };

      if (this.canEditGoalType) {
        updateData.goalType = this.goalType;
      }

      this.goalsService.updateGoal(this.goal.id, updateData).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => {
          console.error('Error updating goal', err);
        },
      });

      return;
    }

    this.goalsService
      .createGoal({
        title: this.title,
        description: this.description,
        goalType: this.goalType,
      })
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => {
          console.error('Error creating goal', err);
        },
      });
  }

  cancel() {
    this.formClosed.emit();
  }
}
