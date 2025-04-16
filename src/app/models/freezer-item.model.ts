export interface FreezerItem {
  id: string;
  description: string;
  photoData: string;
  storageDate: string;
  expiryDate: string;
  isPlannedForConsumption: boolean;
  plannedConsumptionDate?: string;
  defrostTime?: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  reminderSettings: {
    expiryEnabled: boolean;
    defrostEnabled: boolean;
  };
  isExpiringSoon: boolean;
  daysUntilExpiry: number;
} 