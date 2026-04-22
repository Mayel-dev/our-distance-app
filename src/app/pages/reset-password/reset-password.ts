import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  token = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  errorMessage = '';

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.token = params.get('token') ?? '';
    });
  }

  submit(): void {
    this.message = '';
    this.errorMessage = '';

    if (!this.token) {
      this.errorMessage = 'Ingresa el token de recuperacion';
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Completa ambos campos de contrasena';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contrasenas no coinciden';
      return;
    }

    this.authService
      .resetPassword({
        token: this.token,
        newPassword: this.newPassword,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.message = response.message;
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (error: any) => {
          this.errorMessage = error?.error?.message || 'No se pudo restablecer la contrasena';
        },
      });
  }
}
