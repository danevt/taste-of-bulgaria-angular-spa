import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({
    withCredentials: true,
  });

  return next(clonedReq);
};