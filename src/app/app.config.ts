import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app.routes';
import { FreezerService } from './services/freezer.service';
import { IndexedDBService } from './services/indexeddb.service';
import { NotificationService } from './services/notification.service';
import { CalendarService } from './services/calendar.service';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideIonicAngular({
      mode: 'md'
    }),
    provideAnimations(),
    { provide: FreezerService, useClass: FreezerService },
    { provide: IndexedDBService, useClass: IndexedDBService },
    { provide: NotificationService, useClass: NotificationService },
    { provide: CalendarService, useClass: CalendarService },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}; 