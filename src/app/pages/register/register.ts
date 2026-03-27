import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthResponse, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  username = '';
  email = '';
  password = '';

  register(): void {
    this.authService
      .register({
        username: this.username,
        email: this.email,
        password: this.password,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: AuthResponse) => {
          this.authService.saveToken(response.access_token);
          this.router.navigate(['/home']);
        },
        error: (err: unknown) => {
          console.error('Error al registrarse', err);
          alert('Error al crear cuenta');
        },
      });
  }
}
