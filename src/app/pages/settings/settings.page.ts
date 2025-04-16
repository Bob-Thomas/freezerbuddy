import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndexedDBService } from '../../services/indexeddb.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  notificationsEnabled: boolean = true;
  reminderTime: string = 'morning';
  daysBeforeExpiry: string = '3';
  pendingNotifications: any[] = [];

  constructor(
    private indexedDB: IndexedDBService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    const settings = await this.indexedDB.getSettings();
    this.notificationsEnabled = settings.notificationsEnabled;
    this.reminderTime = settings.reminderTime;
    this.daysBeforeExpiry = settings.daysBeforeExpiry;
    await this.loadPendingNotifications();
  }

  async loadPendingNotifications() {
    this.pendingNotifications = await this.notificationService.getPendingNotifications();
  }

  async toggleNotifications() {
    await this.indexedDB.updateSettings({
      notificationsEnabled: this.notificationsEnabled,
      reminderTime: this.reminderTime,
      daysBeforeExpiry: this.daysBeforeExpiry
    });
    await this.loadPendingNotifications();
  }

  async updateReminderTime() {
    await this.indexedDB.updateSettings({
      notificationsEnabled: this.notificationsEnabled,
      reminderTime: this.reminderTime,
      daysBeforeExpiry: this.daysBeforeExpiry
    });
    await this.loadPendingNotifications();
  }

  async updateDaysBeforeExpiry() {
    await this.indexedDB.updateSettings({
      notificationsEnabled: this.notificationsEnabled,
      reminderTime: this.reminderTime,
      daysBeforeExpiry: this.daysBeforeExpiry
    });
    await this.loadPendingNotifications();
  }
} 