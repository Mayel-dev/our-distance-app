import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthResponse, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  email = '';
  password = '';

  login(): void {
    this.authService
      .login({ email: this.email, password: this.password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: AuthResponse) => {
          this.authService.saveSession(response);
          this.router.navigate(['/home']);
        },
        error: (err: unknown) => {
          console.error('Error al iniciar sesion', err);
          alert('Credenciales incorrectas');
        },
      });
  }
}
