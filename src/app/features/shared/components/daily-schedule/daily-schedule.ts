import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { WeekDaysService } from '../../../../core/services/week-days.service';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { DailySchedule } from '../../../../core/models/daily-schedule.model';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'daily-schedule',
  imports: [
    CommonModule,
    CardModule,
    BadgeModule,
    TooltipModule,
    TranslateModule
  ],
  templateUrl: './daily-schedule.html',
  styleUrl: './daily-schedule.scss'
})
export class DailyScheduleComponent  {

  //#region Services
  private weekDaysService = inject(WeekDaysService);
  //#endregion

  @Input() dailySchedules: DailySchedule[] = [];

  //#region Methods
  ngOnInit(): void {
    this.prepareDailySchedule();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['dailySchedules']) {
      this.dailySchedules = [...(this.dailySchedules || [])];
      this.prepareDailySchedule();
    }
  }

  getUniqueDays(): any[] {
    if (!this.dailySchedules || !Array.isArray(this.dailySchedules)) {
      return [];
    }
    let days = this.dailySchedules.filter(schedule => schedule.dayName !== '')?.map(schedule => schedule.dayName);
    return this.weekDaysService?.getDayOptions()?.filter(day => days?.includes(day.label)) || [];
  }

  prepareDailySchedule(): void {
    this.dailySchedules?.forEach(schedule => {
      schedule.dayName = this.weekDaysService?.getDayName(schedule.day);
    });
  }

  getTime(time: string) {
    return TimeHelper.displayTime(time);
  }

  isToday(dayIndex: number): boolean {
    return dayIndex === new Date().getDay() + 1;
  }

  getClassesByDay(day: number): DailySchedule[] {
    if (!this.dailySchedules || !Array.isArray(this.dailySchedules)) {
      return [];
    }
    return this.dailySchedules.filter(schedule => schedule.day === day);
  }

  //#endregion

}
