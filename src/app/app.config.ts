import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app.routes';
import { FreezerService } from './services/freezer.service';
import { IndexedDBService } from './services/indexeddb.service';
import { NotificationService } from './services/notification.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    { provide: FreezerService, useClass: FreezerService },
    { provide: IndexedDBService, useClass: IndexedDBService },
    { provide: NotificationService, useClass: NotificationService }
  ]
}; 