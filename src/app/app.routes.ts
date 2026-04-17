import { Routes } from '@angular/router';
import { NotFound } from './shared/components/not-found/not-found';

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
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((c) => c.Register),
  },

  {
    path: '**',
    component: NotFound,
  },
];
