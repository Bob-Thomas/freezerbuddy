import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexedDBService } from '../../services/indexed-db.service';
import { CameraService } from '../../services/camera.service';
import { NotificationService } from '../../services/notification.service';
import { CalendarService } from '../../services/calendar.service';
import { CalendarModalComponent } from '../../components/calendar-modal/calendar-modal.component';
import { FreezerItem } from '../../models/freezer-item.model';
import { addIcons } from 'ionicons';
import { checkmarkOutline, cameraOutline, imagesOutline, calendarOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonToggle,
  IonItemGroup,
  IonSelect,
  IonSelectOption,
  ModalController,
  IonPopover,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonNote,
  IonFab,
  IonFabButton,
  IonFabList
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonToggle,
    IonItemGroup,
    IonSelect,
    IonSelectOption,
    IonPopover,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonNote,
    IonFab,
    IonFabButton,
    IonFabList
  ]
})
export class AddItemPage implements OnInit {
  item: FreezerItem = {
    id: this.generateId(),
    description: '',
    photoData: '',
    storageDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
    defrostTime: {
      value: 24,
      unit: 'hours'
    },
    reminderSettings: {
      defrostEnabled: false,
      expiryEnabled: false
    },
    plannedConsumptionDate: undefined,
    isPlannedForConsumption: false,
    isExpiringSoon: false,
    daysUntilExpiry: 30
  };

  constructor(
    private indexedDBService: IndexedDBService,
    private cameraService: CameraService,
    private notificationService: NotificationService,
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) {
    addIcons({
      'checkmark-outline': checkmarkOutline,
      'camera-outline': cameraOutline,
      'images-outline': imagesOutline,
      'calendar-outline': calendarOutline
    });
  }

  async ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      const items = await this.indexedDBService.getItems();
      const existingItem = items.find(item => item.id === itemId);
      if (existingItem) {
        // Ensure defrostTime is initialized when editing
        this.item = {
          ...existingItem,
          defrostTime: existingItem.defrostTime || {
            value: 24,
            unit: 'hours'
          }
        };
      }
    }
  }

  updateDefrostTimeValue(value: number) {
    if (!this.item.defrostTime) {
      this.item.defrostTime = {
        value: value,
        unit: 'hours' // Default unit
      };
    } else {
      this.item.defrostTime.value = value;
    }
  }

  updateDefrostTimeUnit(unit: 'minutes' | 'hours' | 'days') {
    if (!this.item.defrostTime) {
      this.item.defrostTime = {
        value: 24, // Default value
        unit: unit
      };
    } else {
      this.item.defrostTime.unit = unit;
    }
  }

  async takePhoto() {
    try {
      this.item.photoData = await this.cameraService.takePhoto();
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  }

  async selectPhoto() {
    try {
      this.item.photoData = await this.cameraService.selectPhoto();
    } catch (error) {
      console.error('Error selecting photo:', error);
    }
  }

  async saveItem() {
    await this.indexedDBService.saveItem(this.item);
    
    // Handle notification scheduling
    if (this.item.reminderSettings.defrostEnabled && this.item.reminderSettings.expiryEnabled) {
      await this.notificationService.updateReminders(this.item);
    }
    
    // Show calendar modal
    const modal = await this.modalController.create({
      component: CalendarModalComponent,
      componentProps: {
        item: this.item
      },
      cssClass: 'calendar-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      const { defrostAdded, expiryAdded } = data;
      if (defrostAdded || expiryAdded) {
        console.log('Calendar events added:', { defrostAdded, expiryAdded });
      }
    }

    this.router.navigate(['/inventory']);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 