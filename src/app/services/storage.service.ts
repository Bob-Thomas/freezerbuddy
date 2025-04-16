import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FreezerItem } from '../models/freezer-item.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'freezer_items';

  async getItems(): Promise<FreezerItem[]> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  }

  async saveItem(item: FreezerItem): Promise<void> {
    const items = await this.getItems();
    const index = items.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }

    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(items)
    });
  }

  async removeItem(id: string): Promise<void> {
    const items = await this.getItems();
    const filteredItems = items.filter(item => item.id !== id);
    
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(filteredItems)
    });
  }
} 