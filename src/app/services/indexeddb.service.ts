import { Injectable } from '@angular/core';
import { FreezerItem } from '../models/freezer-item.model';

interface AppSettings {
  notificationsEnabled: boolean;
  reminderTime: string;
  daysBeforeExpiry: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private readonly DB_NAME = 'freezerBuddyDB';
  private readonly ITEMS_STORE_NAME = 'freezerItems';
  private readonly SETTINGS_STORE_NAME = 'settings';
  private readonly DB_VERSION = 2; // Incremented version number
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Error opening database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.ITEMS_STORE_NAME)) {
          db.createObjectStore(this.ITEMS_STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(this.SETTINGS_STORE_NAME)) {
          db.createObjectStore(this.SETTINGS_STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.initDB();
    }
    return this.db!.transaction(storeName, mode).objectStore(storeName);
  }

  // Freezer Items methods
  async getItems(): Promise<FreezerItem[]> {
    const store = await this.getStore(this.ITEMS_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateItem(item: FreezerItem): Promise<void> {
    const store = await this.getStore(this.ITEMS_STORE_NAME, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteItem(id: string): Promise<void> {
    const store = await this.getStore(this.ITEMS_STORE_NAME, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Settings methods
  async getSettings(): Promise<AppSettings> {
    const store = await this.getStore(this.SETTINGS_STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.get('appSettings');
      request.onsuccess = () => {
        const settings = request.result || {
          notificationsEnabled: true,
          reminderTime: 'morning',
          daysBeforeExpiry: '3'
        };
        resolve(settings);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateSettings(settings: AppSettings): Promise<void> {
    const store = await this.getStore(this.SETTINGS_STORE_NAME, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put({ ...settings, id: 'appSettings' });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
} 