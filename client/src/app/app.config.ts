import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { addCredentialsInterceptor } from './core/add-credentials-interceptor';
import { AuthService } from './shared/services/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptors([addCredentialsInterceptor]),
    ),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.checkIfLoggedIn();
    }),
  ]
};
