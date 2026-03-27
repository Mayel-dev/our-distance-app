import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  imports: [Navbar, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  user: User | null = null;

  ngOnInit(): void {
    this.authService
      .getMe()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: User) => {
          this.user = response;
        },
        error: (err: unknown) => {
          console.error('Error al obtener usuario', err);
        },
      });
  }
}
