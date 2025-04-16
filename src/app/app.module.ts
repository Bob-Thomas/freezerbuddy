import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FreezerService } from './services/freezer.service';
import { IndexedDBService } from './services/indexeddb.service';
import { NotificationService } from './services/notification.service';

@NgModule({
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule
  ],
  declarations: [],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FreezerService,
    IndexedDBService,
    NotificationService
  ]
})
export class AppModule {} 