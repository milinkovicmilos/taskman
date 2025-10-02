import { HttpInterceptorFn } from '@angular/common/http';

export const addCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({
    withCredentials: true,
  });

  return next(clonedReq);
};
