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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (response: any) => {
        this.pairingCode = response.pairingCode;
        this.partner = response.partner || null;
      },
    });
  }

  connect() {
    this.authService.connectPartner(this.partnerCode).subscribe({
      next: () => {
        this.message = '¡Pareja conectada exitosamente! ❤️';
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
          this.partner = null;
          this.message = 'Pareja desconectada';
          this.ngOnInit();
        },
      });
    }
  }
}
