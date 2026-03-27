import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  private readonly router = inject(Router);

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
