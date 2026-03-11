import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pairing',
  imports: [Navbar, FormsModule],
  templateUrl: './pairing.html',
  styleUrl: './pairing.css',
})
export class Pairing implements OnInit {
  pairingCode = '';
  partnerCode = '';
  message = '';
  partner: any = null;
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadPairingData();
  }

  loadPairingData() {
    this.loading = true;

    this.authService.getMe().subscribe({
      next: (response: any) => {
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

  connect() {
    this.authService.connectPartner(this.partnerCode).subscribe({
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

  copyCode() {
    navigator.clipboard.writeText(this.pairingCode);
    this.message = '¡Código copiado!';
  }

  disconnect() {
    if (confirm('¿Seguro que quieres desconectarte de tu pareja?')) {
      this.authService.disconnectPartner().subscribe({
        next: () => {
          this.message = 'Pareja desconectada';
          this.loadPairingData();
        },
      });
    }
  }
}
