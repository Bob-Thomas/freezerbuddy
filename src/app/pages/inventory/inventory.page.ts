import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { FreezerItem } from '../../models/freezer-item.model';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, optionsOutline } from 'ionicons/icons';
import { IndexedDBService } from '../../services/indexed-db.service';

type SortOption = 'expiry' | 'added' | 'name';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    TimeAgoPipe,
  ]
})
export class InventoryPage {
  items: FreezerItem[] = [];
  currentSort: SortOption = 'expiry';

  constructor(
    private router: Router,
    private indexedDBService: IndexedDBService
  ) {
    addIcons({ add, optionsOutline });
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  private async loadItems() {
    try {
      this.items = await this.indexedDBService.getItems();
      this.updateItemStatuses();
      this.sortItems(this.currentSort);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  private updateItemStatuses() {
    const today = new Date();
    this.items.forEach(item => {
      const expiryDate = new Date(item.expiryDate);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      item.daysUntilExpiry = diffDays;
      item.isExpiringSoon = diffDays <= 7;
    });
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    // Implement search functionality
    console.log('Search:', query);
  }

  onSortChange(event: any) {
    const sortBy = event.detail.value as SortOption;
    this.sortItems(sortBy);
  }

  private sortItems(sortBy: SortOption) {
    this.currentSort = sortBy;
    this.items.sort((a, b) => {
      switch (sortBy) {
        case 'expiry':
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        case 'added':
          return new Date(b.storageDate).getTime() - new Date(a.storageDate).getTime();
        case 'name':
          return a.description.localeCompare(b.description);
        default:
          return 0;
      }
    });
  }

  onLocationFilter(event: any) {
    // Implement location filtering
    console.log('Location filter:', event.detail.value);
  }

  onAddItem() {
    this.router.navigate(['/add-item']);
  }
} 