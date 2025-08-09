import { Component } from '@angular/core';
import { CardContainer } from "../../../shared/components/card-container/card-container";
import { TranslateModule } from '@ngx-translate/core';
import { ScheduleForm } from "../schedule-form/schedule-form";
import { ClassSchedule } from '../../../../core/models/class-schedule.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scheduls-calendar',
  imports: [
    CommonModule,
    CardContainer,
    TranslateModule,
    ScheduleForm
],
  templateUrl: './scheduls-calendar.html',
  styleUrl: './scheduls-calendar.scss'
})
export class SchedulsCalendar {

  showDialog = false;
  schedule: ClassSchedule = {} as ClassSchedule;

  onAdd() {
    this.showDialog = true;
  }

  onSave() {
    console.log('onSave');
  }

  onCancel() {
    this.showDialog = false;
  }

}
