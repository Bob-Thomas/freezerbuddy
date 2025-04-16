import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FreezerItem } from '../models/freezer-item.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly EXPIRY_REMINDER_DAYS = 3; // Notify 3 days before expiry

  constructor() {
    this.initializeNotifications();
  }

  private async initializeNotifications() {
    try {
      // Request permission to use notifications
      const permission = await LocalNotifications.requestPermissions();
      if (!permission.display) {
        console.error('Notification permission not granted');
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  async scheduleDefrostReminder(item: FreezerItem) {
    if (!item.isPlannedForConsumption || !item.plannedConsumptionDate || 
        !item.defrostTime || !item.reminderSettings.defrostEnabled) {
      return;
    }

    const plannedDate = new Date(item.plannedConsumptionDate);
    let milliseconds = 0;

    // Calculate defrost time in milliseconds
    switch (item.defrostTime.unit) {
      case 'minutes':
        milliseconds = item.defrostTime.value * 60 * 1000;
        break;
      case 'hours':
        milliseconds = item.defrostTime.value * 60 * 60 * 1000;
        break;
      case 'days':
        milliseconds = item.defrostTime.value * 24 * 60 * 60 * 1000;
        break;
    }

    // Calculate when to send the notification (planned consumption time minus defrost time)
    const notificationTime = new Date(plannedDate.getTime() - milliseconds);

    // Don't schedule if the time has already passed
    if (notificationTime.getTime() <= Date.now()) {
      console.warn('Defrost notification time has already passed');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: this.getDefrostNotificationId(item.id),
            title: 'Time to Defrost!',
            body: `Start defrosting ${item.description} for your planned meal`,
            schedule: { at: notificationTime },
            extra: {
              itemId: item.id,
              type: 'defrost'
            }
          }
        ]
      });

      console.log('Defrost reminder scheduled for:', notificationTime);
    } catch (error) {
      console.error('Error scheduling defrost notification:', error);
    }
  }

  async scheduleExpiryReminder(item: FreezerItem) {
    if (!item.reminderSettings.expiryEnabled) {
      return;
    }

    const expiryDate = new Date(item.expiryDate);
    const notificationTime = new Date(expiryDate.getTime() - (this.EXPIRY_REMINDER_DAYS * 24 * 60 * 60 * 1000));

    // Don't schedule if the time has already passed
    if (notificationTime.getTime() <= Date.now()) {
      console.warn('Expiry notification time has already passed');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: this.getExpiryNotificationId(item.id),
            title: 'Item Expiring Soon!',
            body: `${item.description} will expire in ${this.EXPIRY_REMINDER_DAYS} days`,
            schedule: { at: notificationTime },
            extra: {
              itemId: item.id,
              type: 'expiry'
            }
          }
        ]
      });

      console.log('Expiry reminder scheduled for:', notificationTime);
    } catch (error) {
      console.error('Error scheduling expiry notification:', error);
    }
  }

  private getDefrostNotificationId(itemId: string): number {
    // Use different ranges for different notification types to avoid ID conflicts
    return parseInt(itemId, 36);
  }

  private getExpiryNotificationId(itemId: string): number {
    // Add an offset to the base ID for expiry notifications
    return parseInt(itemId, 36) + 1000000;
  }

  async cancelReminders(itemId: string) {
    try {
      await LocalNotifications.cancel({
        notifications: [
          { id: this.getDefrostNotificationId(itemId) },
          { id: this.getExpiryNotificationId(itemId) }
        ]
      });
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  async updateReminders(item: FreezerItem) {
    // First cancel any existing reminders
    await this.cancelReminders(item.id);
    
    // Schedule new reminders if enabled
    if (item.reminderSettings.expiryEnabled) {
      await this.scheduleExpiryReminder(item);
    }
    if (item.isPlannedForConsumption && item.reminderSettings.defrostEnabled) {
      await this.scheduleDefrostReminder(item);
    }
  }
} 