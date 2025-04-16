import { Injectable, inject } from '@angular/core';
import { FreezerItem } from '../models/freezer-item.model';
import { IndexedDBService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class FreezerService {
  private readonly indexedDBService = inject<IndexedDBService>(IndexedDBService);

  async getItem(id: string): Promise<FreezerItem | null> {
    const items = await this.indexedDBService.getItems();
    return items.find(item => item.id === id) || null;
  }

  async updateItem(item: FreezerItem): Promise<void> {
    await this.indexedDBService.saveItem(item);
  }

  async deleteItem(id: string): Promise<void> {
    await this.indexedDBService.removeItem(id);
  }

  async getAllItems(): Promise<FreezerItem[]> {
    return await this.indexedDBService.getItems();
  }
} 