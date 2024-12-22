import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/emails/emails.component')
      .then(m => m.EmailsComponent),
    title: 'Email | Mailboxes'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        loadComponent: () => import('./pages/auth/sign-in/sign-in.component')
          .then(m => m.SignInComponent),
        title: 'Email | Sign-In'
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./pages/auth/sign-up/sign-up.component')
          .then(m => m.SignUpComponent),
        title: 'Email | Sign-Up'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home',
  }
]