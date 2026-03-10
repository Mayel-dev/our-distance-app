import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [Navbar, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: User | null = null;
  showForm = false;
  newUsername = '';
  newPassword = '';
  message = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (response: any) => {
        this.user = response;
        this.newUsername = response.username;
      },
    });
  }

  currentPassword = '';

  update() {
    const data: any = {};
    if (this.newUsername) data.username = this.newUsername;
    if (this.newPassword) {
      data.password = this.newPassword;
      data.currentPassword = this.currentPassword;
    }

    this.authService.updateMe(data).subscribe({
      next: () => {
        this.message = '¡Perfil actualizado! ✅';
        this.showForm = false;
        this.ngOnInit();
      },
      error: (err) => {
        this.message = err.error.message || 'Error al actualizar perfil';
      },
    });
  }

  deleteAccount() {
    if (confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.authService.deleteMe().subscribe({
        next: () => {
          this.authService.logout();
        },
      });
    }
  }
}
