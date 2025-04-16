import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { IndexedDBService } from './indexed-db.service';
import { FreezerItem } from '../models/freezer-item.model';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private readonly STORAGE_KEY = 'freezer_items';
  private migrationComplete = false;

  constructor(private indexedDBService: IndexedDBService) {}

  async migrateIfNeeded(): Promise<void> {
    if (this.migrationComplete) {
      return;
    }

    try {
      // Check if we have data in Preferences
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      
      if (value) {
        const items: FreezerItem[] = JSON.parse(value);
        
        // Migrate each item to IndexedDB
        for (const item of items) {
          await this.indexedDBService.saveItem(item);
        }
        
        // Clear the old data
        await Preferences.remove({ key: this.STORAGE_KEY });
      }
      
      this.migrationComplete = true;
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
} 