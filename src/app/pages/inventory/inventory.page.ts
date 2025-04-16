import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { FreezerItem } from '../../models/freezer-item';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

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
    TimeAgoPipe,
  ]
})
export class InventoryPage {
  items: FreezerItem[] = [
    {
      id: '1',
      name: 'Frozen Pizza',
      image: 'assets/placeholder.png',
      quantity: 2,
      unit: 'pc',
      addedDate: new Date('2024-03-15'),
      expiryDate: new Date('2024-06-20'),
      location: 'freezer',
      isExpiringSoon: false,
      daysUntilExpiry: 90
    },
    {
      id: '2',
      name: 'Ice Cream',
      image: 'assets/placeholder.png',
      quantity: 1,
      unit: 'pint',
      addedDate: new Date('2024-03-10'),
      expiryDate: new Date('2024-03-25'),
      location: 'freezer',
      isExpiringSoon: true,
      daysUntilExpiry: 2
    }
  ];

  currentSort: SortOption = 'expiry';

  constructor(private router: Router) {
    this.sortItems('expiry');
    addIcons({ add });
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
          return (a.daysUntilExpiry ?? Infinity) - (b.daysUntilExpiry ?? Infinity);
        case 'added':
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
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
    // Implement add item functionality
    console.log('Add item clicked');
    this.router.navigate(['/add-item']);
  }
} 