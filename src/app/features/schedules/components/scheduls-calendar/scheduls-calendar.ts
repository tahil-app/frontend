import { Component, inject, OnInit } from '@angular/core';
import { CardContainer } from "../../../shared/components/card-container/card-container";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScheduleDialog } from "../schedule-dialog/schedule-dialog";
import { ClassSchedule } from '../../../../core/models/class-schedule.model';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Calendar } from '../../../shared/components/calendar/calendar';
import { CalendarProps } from '../../../shared/props/calendar.props';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { ScheduleForm } from '../schedule-form/schedule-form';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmDeleteService } from '../../../shared/services/confirm-delete-service';

@Component({
  selector: 'app-scheduls-calendar',
  imports: [
    CommonModule,
    CardContainer,
    TranslateModule,
    ScheduleDialog,
    Calendar,
    ScheduleForm
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
  schedule: ClassSchedule = {} as ClassSchedule;
  schedules: ClassSchedule[] = [];
  scheduleToDelete: ClassSchedule = {} as ClassSchedule;
  activeDayIsOpen: boolean = false;

  destroy$ = new Subject<void>();
  currentDate = new Date();

  //#endregion

  //#region Services
  private translateService = inject(TranslateService);
  private scheduleService = inject(ScheduleService);
  private loader = inject(LoaderService);
  private confirmDeleteService = inject(ConfirmDeleteService);
  public permissionService = inject(PermissionAccessService);
  //#endregion

  //#region Methods
  ngOnInit(): void {
    this.setupCalendarConfig();
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEvents(): void {

    this.loader.show();
    let currentMonth = this.currentDate.getMonth() + 1;
    let currentYear = this.currentDate.getFullYear();

    this.scheduleService.getMonthlySchedule(currentMonth, currentYear).pipe(takeUntil(this.destroy$)).subscribe(schedules => {
      this.schedules = schedules;
      
      this.events = this.prepareEvents(schedules);
      this.setupCalendarConfig();
      
      this.activeDayIsOpen = this.schedules.some(schedule => schedule.day === this.currentDate.getDay() && new Date(schedule.startDate!) <= this.currentDate);
    }, err => { }, () => {
      this.showDialog = false;
      this.showScheduleForm = false;
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
            <td class="text-light"><b>${group}: </b><br/>&nbsp;</td>
            <td>
              &nbsp;${schedule?.groupName}
              <br/>
              &nbsp;${TimeHelper.displayTime(schedule?.startTime ?? '')} - ${TimeHelper.displayTime(schedule?.endTime ?? '')}
            </td>
          </tr>
          <tr>
            <td class="text-light"><b>${teacher}:</b></td>
            <td>&nbsp;${schedule?.teacherName}</td>
          </tr>
          <tr>
            <td class="text-light"><b>${room}:</b></td>
            <td>&nbsp;${schedule?.roomName}</td>
          </tr>
          <tr>
            <td class="text-light"><b>${course}:</b></td>
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

    this.confirmDeleteService.confirm(
      () => this.onDeleteConfirm(), 
      `${this.translateService.instant('shared.dialogs.deleteConfirmation')} <br /> <span class="deleted-item-name">${this.scheduleToDelete.groupName}</span>`
    );
  }

  onDeleteConfirm(): void {
    this.loader.show();
    this.scheduleService.delete(this.scheduleToDelete.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadEvents();
      },
      error: (error: any) => {
        console.error('Error deleting schedule:', error);
      },
      complete: () => {
        this.loader.hide();
      }
    });
  }

  onDeleteCancel(): void {
    this.scheduleToDelete = {} as ClassSchedule;
  }

  onSave() {
    this.showScheduleForm = false;
    this.loadEvents();
  }

  onAdd(): void {
    this.showScheduleForm = true;
  }

  //#endregion

  //#region Calendar Events

  onNext(event: any): void {
    if(event.getMonth() != this.currentDate.getMonth() || event.getFullYear() != this.currentDate.getFullYear()) {
      this.currentDate = new Date(event.getFullYear(), event.getMonth(), 1);
      this.loadEvents();
    } 
  }

  onPrev(event: any): void {
    if(event.getMonth() != this.currentDate.getMonth() || event.getFullYear() != this.currentDate.getFullYear()) {
      this.currentDate = new Date(event.getFullYear(), event.getMonth(), 1);
      this.loadEvents();
    } 
  }

  onToday(event: any): void {
    this.currentDate = new Date();
    this.loadEvents();
  }

  //#endregion
}
