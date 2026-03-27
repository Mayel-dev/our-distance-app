import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);

  isMenuOpen = false;

  readonly navLinks: ReadonlyArray<{ route: string; label: string; icon: string }> = [
    { route: '/home', label: 'Inicio', icon: '🏠' },
    { route: '/goals', label: 'Metas', icon: '🎯' },
    { route: '/pairing', label: 'Conectar', icon: '💑' },
    { route: '/profile', label: 'Perfil', icon: '👤' },
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
