import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { Subject } from 'rxjs';
import { ClassSchedule } from '../../../../core/models/class-schedule.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DayOfWeek } from '../../../../core/enums/day-week.enum';
import { ClassScheduleStatus } from '../../../../core/enums/class-schedule-status.enum';

@Component({
  selector: 'schedule-dialog',
  imports: [
    CommonModule,
    DialogModule,
    CancelBtn,
    TranslateModule,
  ],
  templateUrl: './schedule-dialog.html',
  styleUrl: './schedule-dialog.scss'
})
export class ScheduleDialog {

  @Input() showDialog = false;
  @Input() schedule: ClassSchedule = {} as ClassSchedule;

  @Output() onClose = new EventEmitter<void>();

  destroy$ = new Subject<void>();

  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit() {
    // Component initialization
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog) {
      this.cdr.detectChanges();
    }
  }

  getDayName(day: DayOfWeek): string {
    const dayNames: { [key in DayOfWeek]: string } = {
      [DayOfWeek.Saturday]: this.translate.instant('shared.days.saturday'),
      [DayOfWeek.Sunday]: this.translate.instant('shared.days.sunday'),
      [DayOfWeek.Monday]: this.translate.instant('shared.days.monday'),
      [DayOfWeek.Tuesday]: this.translate.instant('shared.days.tuesday'),
      [DayOfWeek.Wednesday]: this.translate.instant('shared.days.wednesday'),
      [DayOfWeek.Thursday]: this.translate.instant('shared.days.thursday'),
      [DayOfWeek.Friday]: this.translate.instant('shared.days.friday')
    };
    return dayNames[day] || '';
  }

  getStatusName(status: ClassScheduleStatus): string {
    const statusNames: { [key in ClassScheduleStatus]: string } = {
      [ClassScheduleStatus.New]: this.translate.instant('schedules.status.new'),
      [ClassScheduleStatus.Active]: this.translate.instant('schedules.status.active'),
      [ClassScheduleStatus.Paused]: this.translate.instant('schedules.status.paused'),
      [ClassScheduleStatus.Completed]: this.translate.instant('schedules.status.completed'),
      [ClassScheduleStatus.Cancelled]: this.translate.instant('schedules.status.cancelled')
    };
    return statusNames[status] || '';
  }

  getStatusClass(status: ClassScheduleStatus): string {
    const statusClasses: { [key in ClassScheduleStatus]: string } = {
      [ClassScheduleStatus.New]: 'status-new',
      [ClassScheduleStatus.Active]: 'status-active',
      [ClassScheduleStatus.Paused]: 'status-paused',
      [ClassScheduleStatus.Completed]: 'status-completed',
      [ClassScheduleStatus.Cancelled]: 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

  formatTime(time: string): string {
    if (!time) return '';
    // Assuming time is in HH:mm:ss format, display as HH:mm
    return time.substring(0, 5);
  }

  formatDate(date: string | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  close() {
    this.onClose.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 