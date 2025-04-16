import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexedDBService } from '../../services/indexed-db.service';
import { NotificationService } from '../../services/notification.service';
import { FreezerItem } from '../../models/freezer-item.model';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, notificationsOutline } from 'ionicons/icons';
import { FreezerService } from '../../services/freezer.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ItemDetailsPage implements OnInit {
  item: FreezerItem | null = null;

  constructor(
    private indexedDBService: IndexedDBService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private freezerService: FreezerService
  ) {
    addIcons({
      'create-outline': createOutline,
      'trash-outline': trashOutline,
      'notifications-outline': notificationsOutline
    });
  }

  async ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.item = await this.freezerService.getItem(itemId);
    }
  }

  async toggleExpiryReminder() {
    if (!this.item) return;

    if (this.item.reminderSettings.expiryEnabled) {
      await this.notificationService.cancelReminders(this.item.id);
      this.item.reminderSettings.expiryEnabled = false;
    } else {
      this.item.reminderSettings.expiryEnabled = true;
      await this.notificationService.scheduleExpiryReminder(this.item);
    }

    await this.freezerService.updateItem(this.item);
  }

  async toggleDefrostReminder() {
    if (!this.item) return;

    if (this.item.reminderSettings.defrostEnabled) {
      await this.notificationService.cancelReminders(this.item.id);
      this.item.reminderSettings.defrostEnabled = false;
    } else {
      this.item.reminderSettings.defrostEnabled = true;
      await this.notificationService.scheduleDefrostReminder(this.item);
    }

    await this.freezerService.updateItem(this.item);
  }

  async deleteItem() {
    if (!this.item) return;

    // Cancel any existing notifications before removing the item
    if (this.item.reminderSettings.expiryEnabled || this.item.reminderSettings.defrostEnabled) {
      await this.notificationService.cancelReminders(this.item.id);
    }

    await this.freezerService.deleteItem(this.item.id);
    this.router.navigate(['/inventory']);
  }

  getDaysRemaining(): number {
    if (!this.item) return 0;
    const expiryDate = new Date(this.item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysUntilPlanned(): number | null {
    if (!this.item?.plannedConsumptionDate) return null;
    const plannedDate = new Date(this.item.plannedConsumptionDate);
    const today = new Date();
    const diffTime = plannedDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getFormattedDefrostTime(): string {
    if (!this.item?.defrostTime) return '';
    const { value, unit } = this.item.defrostTime;
    return `${value} ${unit}`;
  }

  getDefrostReminderTime(): Date | null {
    if (!this.item?.plannedConsumptionDate || !this.item?.defrostTime) return null;
    
    const plannedDate = new Date(this.item.plannedConsumptionDate);
    const { value, unit } = this.item.defrostTime;
    
    let milliseconds = 0;
    switch (unit) {
      case 'minutes':
        milliseconds = value * 60 * 1000;
        break;
      case 'hours':
        milliseconds = value * 60 * 60 * 1000;
        break;
      case 'days':
        milliseconds = value * 24 * 60 * 60 * 1000;
        break;
    }
    
    return new Date(plannedDate.getTime() - milliseconds);
  }
} 