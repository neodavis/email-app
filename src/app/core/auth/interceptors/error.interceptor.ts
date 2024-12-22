import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/ui/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['auth/sign-in']);
        notificationService.showError('Unauthorized', 'Please sign in to continue');
      } 
      
      if (error.message) {
        notificationService.showError('System error', error.error?.message || 'Please check your input');
      }else if (error.status === 404) {
        notificationService.showError('Not found', 'The requested resource was not found');
      } else if (error.status >= 500) {
        notificationService.showError('Server error', 'Please try again later');
      } else {
        notificationService.showError('Error', 'Something went wrong, contact administrator');
      }

      return throwError(() => error);
    })
  );
};