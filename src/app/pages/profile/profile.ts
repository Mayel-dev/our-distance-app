import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
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
    const updatePayload: UpdateMePayload = {};
    const trimmedUsername = this.newUsername.trim();
    const usernameChanged = !!this.user && trimmedUsername !== this.user.username;
    const wantsPasswordChange = !!this.currentPassword || !!this.newPassword;

    if (!usernameChanged && !wantsPasswordChange) {
      this.message = 'No hay cambios para guardar';
      return;
    }

    if (usernameChanged) {
      updatePayload.username = trimmedUsername;
    }

    if (wantsPasswordChange && (!this.currentPassword || !this.newPassword)) {
      this.message = 'Completa la contrasena actual y la nueva contrasena';
      return;
    }

    let request$: Observable<unknown> = of(null);

    if (updatePayload.username) {
      request$ = this.authService.updateMe(updatePayload);
    }

    if (wantsPasswordChange) {
      request$ = request$.pipe(
        concatMap(() =>
          this.authService.changePassword({
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
          }),
        ),
      );
    }

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (wantsPasswordChange) {
            alert('Contrasena actualizada. Inicia sesion nuevamente.');
            this.authService.clearSession();
            return;
          }

          this.message = 'Perfil actualizado';
          this.showForm = false;
          this.currentPassword = '';
          this.newPassword = '';
          this.reloadUser();
        },
        error: (err: any) => {
          this.message = err?.error?.message || 'Error al actualizar perfil';
        },
      });
  }

  deleteAccount(): void {
    if (confirm('Seguro que quieres eliminar tu cuenta? Esta accion no se puede deshacer.')) {
      this.authService
        .deleteMe()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.authService.clearSession();
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
