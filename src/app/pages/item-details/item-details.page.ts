import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { FreezerItem } from '../../models/freezer-item.model';

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
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      const items = await this.storageService.getItems();
      this.item = items.find(item => item.id === itemId) || null;
    }
  }

  async removeItem() {
    if (this.item) {
      await this.storageService.removeItem(this.item.id);
      this.router.navigate(['/inventory']);
    }
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
} 