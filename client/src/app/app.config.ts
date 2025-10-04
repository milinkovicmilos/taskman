import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { addCredentialsInterceptor } from './core/add-credentials-interceptor';
import { AuthService } from './shared/services/auth-service';
import { handleInternalErrorInterceptor } from './core/handle-internal-error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding()
    ),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptors([addCredentialsInterceptor, handleInternalErrorInterceptor]),
    ),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.checkIfLoggedIn();
    }),
  ]
};
