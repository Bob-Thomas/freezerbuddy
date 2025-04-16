export interface FreezerItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  quantity: number;
  unit: string;
  addedDate: Date;
  expiryDate: Date;
  plannedConsumptionDate?: Date;
  location: 'fridge' | 'freezer' | 'pantry';
  isExpiringSoon?: boolean;
  daysUntilExpiry?: number;
} 