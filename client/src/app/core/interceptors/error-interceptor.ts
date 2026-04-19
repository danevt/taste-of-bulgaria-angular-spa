import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('currentUser');
        errorService.setError('Session expired. Please login again.');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        errorService.setError('You do not have permission to perform this action.');
      } else if (error.status === 404) {
        errorService.setError('Resource not found.');
      } else if (error.status === 409) {
        errorService.setError(error.error?.message || 'Email or username already exists.');
      } else {
        errorService.setError('An unexpected error occurred. Please try again.');
      }

      console.error('HTTP Error:', error);
      return throwError(() => error);
    }),
  );
};
