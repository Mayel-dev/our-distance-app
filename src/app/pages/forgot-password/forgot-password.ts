import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  email = '';
  message = '';
  errorMessage = '';

  submit(): void {
    this.message = '';
    this.errorMessage = '';

    this.authService
      .forgotPassword(this.email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.resetToken) {
            this.router.navigate(['/reset-password'], {
              queryParams: { token: response.resetToken },
            });
            return;
          }

          this.message = response.message;
        },
        error: (error: any) => {
          this.errorMessage = error?.error?.message || 'No se pudo iniciar la recuperacion';
        },
      });
  }
}
