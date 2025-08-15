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
import { ScheduleForm } from '../schedule-form/schedule-form';
import { DeleteConfirmation } from '../../../shared/components/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-scheduls-calendar',
  imports: [
    CommonModule,
    CardContainer,
    TranslateModule,
    ScheduleDialog,
    Calendar,
    ScheduleForm,
    DeleteConfirmation
  ],
  templateUrl: './scheduls-calendar.html',
  styleUrl: './scheduls-calendar.scss'
})
export class SchedulsCalendar implements OnInit {

  //#region Properties
  events: CalendarEvent[] = [];
  calendarConfig: CalendarProps = {};

  showDialog = false;
  showScheduleForm = false;
  showDeleteConfirmation = false;
  schedule: ClassSchedule = {} as ClassSchedule;
  schedules: ClassSchedule[] = [];
  scheduleToDelete: ClassSchedule = {} as ClassSchedule;

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
      this.showScheduleForm = false;
      this.showDeleteConfirmation = false;
      this.loader.hide();
    });

  }

  setupCalendarConfig(): void {

    let group = this.translateService.instant('groups.one');
    let room = this.translateService.instant('rooms.one');
    let teacher = this.translateService.instant('teachers.one');
    let course = this.translateService.instant('courses.one');

    this.calendarConfig = {
      showNavigation: true,
      showViewSwitcher: true,
      defaultView: CalendarView.Month,
      events: this.events,
      showEditBtn: this.permissionService.canEdit.schedule,
      showDeleteBtn: this.permissionService.canDelete.schedule,
      tooltip: (event: CalendarEvent) => {
        let schedule = this.schedules.find(schedule => schedule.id === event.id);

        return `<table>
          <tr>
            <td class="text-secondary"><b>${group}: </b><br/>&nbsp;</td>
            <td>
              &nbsp;${schedule?.groupName}
              <br/>
              &nbsp;${TimeHelper.displayTime(schedule?.startTime ?? '')} - ${TimeHelper.displayTime(schedule?.endTime ?? '')}
            </td>
          </tr>
          <tr>
            <td class="text-secondary"><b>${teacher}:</b></td>
            <td>&nbsp;${schedule?.teacherName}</td>
          </tr>
          <tr>
            <td class="text-secondary"><b>${room}:</b></td>
            <td>&nbsp;${schedule?.roomName}</td>
          </tr>
          <tr>
            <td class="text-secondary"><b>${course}:</b></td>
            <td>&nbsp;${schedule?.courseName}</td>
          </tr>
        </table>`;
      }
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
            title: `${schedule.groupName} (${TimeHelper.displayTime(schedule.startTime)} - ${TimeHelper.displayTime(schedule.endTime)})`,
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
    this.schedule = this.schedules.find(schedule => schedule.id === event.id) ?? {} as ClassSchedule;
    this.showScheduleForm = true;
  }

  deleteEvent(event: CalendarEvent): void {
    this.scheduleToDelete = this.schedules.find(schedule => schedule.id === event.id) ?? {} as ClassSchedule;
    this.showDeleteConfirmation = true;
  }

  onDeleteConfirm(): void {
    this.loader.show();
    this.scheduleService.delete(this.scheduleToDelete.id!).subscribe({
      next: () => {
        this.loadEvents();
        this.showDeleteConfirmation = false;
      },
      error: (error: any) => {
        console.error('Error deleting schedule:', error);
        this.showDeleteConfirmation = false;
      },
      complete: () => {
        this.loader.hide();
      }
    });
  }

  onDeleteCancel(): void {
    this.scheduleToDelete = {} as ClassSchedule;
    this.showDeleteConfirmation = false;
  }

  onSave() {
    this.showScheduleForm = false;
    this.loadEvents();
  }

  //#endregion

}
