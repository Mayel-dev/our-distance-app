import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoalsService } from '../../services/goals.service';
import { Goal } from '../../models/goal.model';

type GoalType = 'PRIVATE' | 'SHARED';
type GoalStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
type GoalCategory = 'HEALTH' | 'FINANCE' | 'LEARNING' | 'TRAVEL' | 'FITNESS' | 'OTHER';

@Component({
  selector: 'goal-form',
  imports: [FormsModule],
  templateUrl: './goal-form.html',
  styleUrl: './goal-form.css',
})
export class GoalForm implements OnInit, OnChanges {
  @Input() isEditing = false;
  @Input() goal: Goal | null = null;
  @Input() hasPartner = false;
  @Input() currentUserId: string | null = null;

  @Output() formClosed = new EventEmitter<void>();
  @Output() goalSaved = new EventEmitter<void>();

  // Propiedades del formulario
  title = '';
  description = '';
  goalType: GoalType = 'PRIVATE';
  status: GoalStatus = 'PENDING';
  category: GoalCategory | '' = '';
  progress = 0;
  targetDate = '';
  titleError = '';
  goalTypeError = '';
  generalError = '';

  constructor(private goalsService: GoalsService) {}

  ngOnInit() {
    if (!this.goal) return;
    this.fillForm(this.goal);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['goal']) {
      if (this.goal) {
        this.fillForm(this.goal);
      } else {
        this.resetForm();
      }
    }
  }

  private fillForm(goal: Goal) {
    this.title = goal.title;
    this.description = goal.description || '';
    this.goalType = goal.goalType;
    this.status = goal.status;
    this.category = (goal.category as GoalCategory) || '';
    this.progress = goal.progress || 0;
    this.targetDate = goal.targetDate
      ? new Date(goal.targetDate).toISOString().split('T')[0]
      : '';
  }

  private resetForm() {
    this.title = '';
    this.description = '';
    this.goalType = 'PRIVATE';
    this.status = 'PENDING';
    this.category = '';
    this.progress = 0;
    this.targetDate = '';
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
    this.titleError = '';
    this.goalTypeError = '';
    this.generalError = '';

    if (!this.title.trim()) {
      this.titleError = 'El título es obligatorio';
      return;
    }

    if (this.goalType === 'SHARED' && !this.hasPartner) {
      this.goalTypeError = 'Necesitas una pareja para crear metas compartidas';
      return;
    }

    if (this.isEditing && this.goal) {
      const updateData: {
        title?: string;
        description?: string;
        status?: GoalStatus;
        goalType?: GoalType;
        category?: GoalCategory;
        progress?: number;
        targetDate?: string;
      } = {
        title: this.title,
        description: this.description,
        status: this.status,
        category: this.category || undefined,
        progress: this.progress,
        targetDate: this.targetDate || undefined,
      };

      if (this.canEditGoalType) {
        updateData.goalType = this.goalType;
      }

      this.goalsService.updateGoal(this.goal.id, updateData).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => {
          this.generalError = err.error?.message || 'Error al actualizar la meta';
        },
      });

      return;
    }

    this.goalsService.createGoal({
      title: this.title,
      description: this.description,
      goalType: this.goalType,
      category: this.category || undefined,
      progress: this.progress,
      targetDate: this.targetDate || undefined,
    }).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => {
        this.generalError = err.error?.message || 'Error al crear la meta';
      },
    });
  }

  cancel() {
    this.formClosed.emit();
  }

  onStatusChange(newStatus: GoalStatus) {
    if (newStatus === 'COMPLETED') {
      this.progress = 100;
    } else if (newStatus === 'PENDING') {
      this.progress = 0;
    }
  }
}
