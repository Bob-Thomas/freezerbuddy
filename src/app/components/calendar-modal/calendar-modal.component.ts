import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FreezerItem } from '../../models/freezer-item.model';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CalendarModalComponent {
  @Input() item!: FreezerItem;
  defrostAdded = false;
  expiryAdded = false;

  constructor(
    private modalController: ModalController,
    private calendarService: CalendarService
  ) {}

  async addDefrostEvent() {
    if (this.item.plannedConsumptionDate) {
      const success = await this.calendarService.addToCalendar(this.item, 'defrost');
      if (success) {
        this.defrostAdded = true;
      }
    }
  }

  async addExpiryEvent() {
    const success = await this.calendarService.addToCalendar(this.item, 'expiry');
    if (success) {
      this.expiryAdded = true;
    }
  }

  done() {
    this.modalController.dismiss({
      defrostAdded: this.defrostAdded,
      expiryAdded: this.expiryAdded
    });
  }

  cancel() {
    this.modalController.dismiss({
      defrostAdded: false,
      expiryAdded: false
    });
  }
} 