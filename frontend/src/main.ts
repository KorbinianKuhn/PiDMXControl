import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    MatIconRegistry,
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
