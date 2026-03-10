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
  @Output() formClosed = new EventEmitter<void>();
  @Output() goalSaved = new EventEmitter<void>();
  @Input() hasPartner = false;

  title = '';
  description = '';
  goalType = 'PRIVATE';
  status = 'PENDING';

  constructor(private goalsService: GoalsService) {}

  ngOnInit() {
    if (this.goal) {
      this.title = this.goal.title;
      this.description = this.goal.description || '';
      this.goalType = this.goal.goalType;
      this.status = this.goal.status; // 👈
    }
  }

  submit() {
    if (this.isEditing && this.goal) {
      this.goalsService
        .updateGoal(this.goal.id, {
          title: this.title,
          description: this.description,
          status: this.status, // 👈
        })
        .subscribe({
          next: () => {
            this.goalSaved.emit();
            this.formClosed.emit();
          },
        });
    } else {
      this.goalsService
        .createGoal({
          title: this.title,
          description: this.description,
          goalType: this.goalType,
        })
        .subscribe({
          next: () => {
            this.goalSaved.emit();
            this.formClosed.emit();
          },
        });
    }
  }

  cancel() {
    this.formClosed.emit();
  }
}
