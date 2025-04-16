import { Injectable } from '@angular/core';
import { FreezerItem } from '../models/freezer-item.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  async addToCalendar(item: FreezerItem, eventType: 'defrost' | 'expiry'): Promise<boolean> {
    try {
      let event;
      
      if (eventType === 'defrost' && item.plannedConsumptionDate) {
        const startTime = new Date(item.plannedConsumptionDate);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes duration
        
        event = {
          title: `Defrost ${item.description}`,
          description: `Defrost time: ${item.defrostTime?.value} ${item.defrostTime?.unit}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          location: 'Freezer',
          status: 'CONFIRMED'
        };
      } else if (eventType === 'expiry' && item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        const startTime = new Date(expiryDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before expiry
        const endTime = expiryDate;
        
        event = {
          title: `${item.description} Expires`,
          description: `This item will expire today. Defrost time: ${item.defrostTime?.value} ${item.defrostTime?.unit}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          location: 'Freezer',
          status: 'CONFIRMED'
        };
      } else {
        return false;
      }

      // Create the calendar event URL
      const calendarUrl = this.generateCalendarUrl(event);
      
      // Open the calendar URL in a new window
      window.open(calendarUrl, '_blank');
      
      return true;
    } catch (error) {
      console.error('Error adding to calendar:', error);
      return false;
    }
  }

  private generateCalendarUrl(event: any): string {
    // Format dates for URL
    const formatDate = (date: string) => {
      return date.replace(/[-:]/g, '').replace('.000', '');
    };

    // Create Google Calendar URL
    const googleCalendarUrl = new URL('https://www.google.com/calendar/render');
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.append('text', event.title);
    googleCalendarUrl.searchParams.append('details', event.description);
    googleCalendarUrl.searchParams.append('location', event.location);
    googleCalendarUrl.searchParams.append('dates', `${formatDate(event.startTime)}/${formatDate(event.endTime)}`);

    return googleCalendarUrl.toString();
  }
} 