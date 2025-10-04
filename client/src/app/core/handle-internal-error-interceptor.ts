import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Notifier } from '../shared/services/notifier';
import { NotificationType } from '../shared/enums/notification-type';

export const handleInternalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(Notifier);
  return next(req).pipe(
    catchError((error) => {
      if (!req.url.includes('api/user') && error.status === 500) {
        notificationService.notify({
          type: NotificationType.Error,
          message: 'There was an error while communicating with the server. Please try again later.',
        });
      }
      return throwError(() => error);
    })
  );
};
