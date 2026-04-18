import { Routes } from '@angular/router';
import { NotFound } from './shared/components/not-found/not-found';
import { authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((c) => c.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((c) => c.Login),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((c) => c.Register),
    canActivate: [guestGuard],
  },
  {
    path: '**',
    component: NotFound,
  },
];
