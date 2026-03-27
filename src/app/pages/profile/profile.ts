import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { AuthService, UpdateMePayload } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [Navbar, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  user: User | null = null;
  showForm = false;
  newUsername = '';
  newPassword = '';
  currentPassword = '';
  message = '';

  ngOnInit(): void {
    this.reloadUser();
  }

  update(): void {
    const data: UpdateMePayload = {};
    if (this.newUsername) data.username = this.newUsername;
    if (this.newPassword) {
      data.password = this.newPassword;
      data.currentPassword = this.currentPassword;
    }

    this.authService
      .updateMe(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.message = '¡Perfil actualizado! ✅';
          this.showForm = false;
          this.reloadUser();
        },
        error: (err: any) => {
          this.message = err?.error?.message || 'Error al actualizar perfil';
        },
      });
  }

  deleteAccount(): void {
    if (confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.authService
        .deleteMe()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.authService.logout();
          },
        });
    }
  }

  private reloadUser(): void {
    this.authService
      .getMe()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: User) => {
          this.user = response;
          this.newUsername = response.username;
        },
      });
  }
}
