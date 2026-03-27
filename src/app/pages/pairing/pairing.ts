import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-pairing',
  imports: [Navbar, FormsModule],
  templateUrl: './pairing.html',
  styleUrl: './pairing.css',
})
export class Pairing implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  pairingCode = '';
  partnerCode = '';
  message = '';
  partner: User | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadPairingData();
  }

  loadPairingData(): void {
    this.loading = true;

    this.authService
      .getMe()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: User) => {
          this.pairingCode = response.pairingCode;
          this.partner = response.partner || null;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.message = 'No se pudo cargar la información de pareja';
        },
      });
  }

  connect(): void {
    this.authService
      .connectPartner(this.partnerCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.message = '¡Pareja conectada exitosamente! ❤️';
          this.partnerCode = '';
          this.loadPairingData();
        },
        error: () => {
          this.message = 'Código inválido o ya tienes pareja conectada';
        },
      });
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.pairingCode);
    this.message = '¡Código copiado!';
  }

  disconnect(): void {
    if (confirm('¿Seguro que quieres desconectarte de tu pareja?')) {
      this.authService
        .disconnectPartner()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.message = 'Pareja desconectada';
            this.loadPairingData();
          },
        });
    }
  }
}
