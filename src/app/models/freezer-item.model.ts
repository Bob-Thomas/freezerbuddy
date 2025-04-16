export interface FreezerItem {
  id: string;
  description: string;
  photoUrl: string;
  storageDate: string;
  expiryDate: string;
  plannedConsumptionDate?: string;
  defrostTime?: string;
  reminderEnabled?: boolean;
} 