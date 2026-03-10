import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Goals } from './pages/goals/goals';
import { Profile } from './pages/profile/profile';
import { Pairing } from './pages/pairing/pairing';

import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/noAuth-guard';

export const routes: Routes = [
  { path: '', component: Welcome, canActivate: [noAuthGuard] },
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'goals', component: Goals, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'pairing', component: Pairing, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
