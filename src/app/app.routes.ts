import { Routes } from '@angular/router';
import { InventoryPage } from './pages/inventory/inventory.page';
import { AddItemPage } from './pages/add-item/add-item.page';
import { ItemDetailsPage } from './pages/item-details/item-details.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    component: InventoryPage
  },
  {
    path: 'add-item',
    component: AddItemPage
  },
  {
    path: 'add-item/:id',
    component: AddItemPage
  },
  {
    path: 'item-details/:id',
    component: ItemDetailsPage
  }
];
