import { Component, inject, OnInit } from '@angular/core';
import { CardContainer } from "../../../shared/components/card-container/card-container";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScheduleDialog } from "../schedule-dialog/schedule-dialog";
import { ClassSchedule } from '../../../../core/models/class-schedule.model';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { Calendar } from '../../../shared/components/calendar/calendar';
import { CalendarProps } from '../../../shared/props/calendar.props';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { TimeHelper } from '../../../../core/helpers/time.helper';

@Component({
  selector: 'app-scheduls-calendar',
  imports: [
    CommonModule,
    CardContainer,
    TranslateModule,
    ScheduleDialog,
    Calendar
  ],
  templateUrl: './scheduls-calendar.html',
  styleUrl: './scheduls-calendar.scss'
})
export class SchedulsCalendar implements OnInit {

  //#region Properties
  events: CalendarEvent[] = [];
  calendarConfig: CalendarProps = {};

  showDialog = false;
  schedule: ClassSchedule = {} as ClassSchedule;
  schedules: ClassSchedule[] = [];

  //#endregion

  //#region Services
  private translateService = inject(TranslateService);
  private permissionService = inject(PermissionAccessService);
  private scheduleService = inject(ScheduleService);
  private loader = inject(LoaderService);
  //#endregion

  //#region Methods
  ngOnInit(): void {
    this.setupCalendarConfig();
    this.loadEvents();
  }

  private loadEvents(): void {

    this.loader.show();
    this.scheduleService.getMonthlySchedule(8, 2025).subscribe(schedules => {
      this.schedules = schedules;
      this.events = this.prepareEvents(schedules);
      this.setupCalendarConfig();
    }, err => { }, () => {
      this.showDialog = false;
      this.loader.hide();
    });

  }

  setupCalendarConfig(): void {
    this.calendarConfig = {
      showNavigation: true,
      showViewSwitcher: true,
      defaultView: CalendarView.Month,
      events: this.events,
      showEditBtn: this.permissionService.canEdit.schedule,
      showDeleteBtn: this.permissionService.canDelete.schedule,
    };
  }

  prepareEvents(schedules: ClassSchedule[]): CalendarEvent[] {

    const events: CalendarEvent[] = [];

    for (const schedule of schedules) {

      let startDate = new Date(schedule.startDate!);
      let endDate = new Date(schedule.endDate ?? "2555-12-31T10:00:00");

      // Loop from viewStart to viewEnd
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === schedule.day) { // Match day of week (0=Sunday,...6=Saturday)

          // Build start/end Date objects
          const start = new Date(date);
          const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
          start.setHours(startHour, startMinute, 0);

          const end = new Date(date);
          const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
          end.setHours(endHour, endMinute, 0);

          // Create event
          events.push({
            id: schedule.id,
            start,
            end,
            title: `${schedule.groupName} (${TimeHelper.getTime(schedule.startTime)} - ${TimeHelper.getTime(schedule.endTime)})`,
            color: {
              primary: schedule.color ?? 'rgb(44, 141, 163)',
              secondary: schedule.color ?? 'rgb(44, 141, 163)'
            }
          });
        }
      }
    }

    return events;
  }

  eventClicked(event: CalendarEvent): void {
    this.schedule = this.schedules.find(schedule => schedule.id === event.id) ?? {} as ClassSchedule;
    this.showDialog = true;
  }

  editEvent(event: CalendarEvent): void {
    console.log('Event clicked:', event);
  }

  deleteEvent(event: CalendarEvent): void {
    console.log('Event clicked:', event);
  }

  onSave() {
    this.loadEvents();
  }

  //#endregion

}
