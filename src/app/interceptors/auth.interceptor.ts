import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

const publicApiPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/users/forgot-password',
  '/users/reset-password',
];

function isApiRequest(url: string): boolean {
  return url.startsWith(environment.apiUrl);
}

function isPublicApiRequest(url: string): boolean {
  return publicApiPaths.some((path) => url.startsWith(`${environment.apiUrl}${path}`));
}

function withBearerToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  if (!isApiRequest(request.url)) {
    return next(request);
  }

  const accessToken = authService.getToken();
  const authorizedRequest =
    accessToken && !isPublicApiRequest(request.url)
      ? withBearerToken(request, accessToken)
      : request;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      const shouldHandleUnauthorized =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isPublicApiRequest(request.url);

      if (shouldHandleUnauthorized && !authService.getRefreshToken()) {
        authService.clearSession();
        return throwError(() => error);
      }

      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        isPublicApiRequest(request.url) ||
        !authService.getRefreshToken()
      ) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap((token) => next(withBearerToken(request, token))),
        catchError((refreshError: unknown) => {
          authService.clearSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
