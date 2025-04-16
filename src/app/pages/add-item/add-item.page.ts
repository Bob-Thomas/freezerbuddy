import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from '../../services/storage.service';
import { FreezerItem } from '../../models/freezer-item.model';
import { addIcons } from 'ionicons';
import { checkmarkOutline, cameraOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class AddItemPage implements OnInit {
  item: FreezerItem = {
    id: this.generateId(),
    description: '',
    photoUrl: '',
    storageDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
    plannedConsumptionDate: undefined,
    defrostTime: '',
    reminderEnabled: false
  };

  constructor(
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({
      'checkmark-outline': checkmarkOutline,
      'camera-outline': cameraOutline
    });
  }

  async ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      const items = await this.storageService.getItems();
      const existingItem = items.find(item => item.id === itemId);
      if (existingItem) {
        this.item = { ...existingItem };
      }
    }
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    if (image.webPath) {
      this.item.photoUrl = image.webPath;
    }
  }

  async saveItem() {
    await this.storageService.saveItem(this.item);
    this.router.navigate(['/inventory']);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 