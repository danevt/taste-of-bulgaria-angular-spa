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
    path: 'recipes',
    loadComponent: () =>
      import('./features/recipes/recipe-board/recipe-board').then((c) => c.RecipeBoard),
  },
  {
    path: 'recipes/:id',
    loadComponent: () =>
      import('./features/recipes/recipe-content/recipe-content').then((c) => c.RecipeContent),
  },
  {
    path: '**',
    component: NotFound,
  },
];
