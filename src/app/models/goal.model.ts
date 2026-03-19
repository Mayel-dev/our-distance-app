import { User } from './user.model';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  goalType: 'PRIVATE' | 'SHARED';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  categoryIcon?: string;
  category?: 'HEALTH' | 'FINANCE' | 'LEARNING' | 'TRAVEL' | 'FITNESS' | 'OTHER';
  progress?: number;
  targetDate?: string;
  createdAt: string;
  createdBy: User;
  partner?: User | null;
}
