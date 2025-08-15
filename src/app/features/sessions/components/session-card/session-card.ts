import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { StatusHelper } from '../../../../core/helpers/status.helper';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';

@Component({
  selector: 'session-card',
  standalone: true,
  imports: [CommonModule, CardModule, BadgeModule, TranslateModule],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss'
})
export class SessionCard {
  @Input() session!: ClassSession;
  @Output() recordAttendance = new EventEmitter<ClassSession>();
  @Output() update = new EventEmitter<ClassSession>();
  @Output() cancel = new EventEmitter<ClassSession>();
  @Output() markCompleted = new EventEmitter<ClassSession>();
  @Output() reschedule = new EventEmitter<ClassSession>();

  public permissionService: PermissionAccessService = inject(PermissionAccessService);
  private confirmService: ConfirmService = inject(ConfirmService);
  private translateService: TranslateService = inject(TranslateService);

  getFormattedDate(): string {
    if (!this.session.date) return '-';
    return new Date(this.session.date).toLocaleDateString();
  }

  getFormattedTime(): string {
    return `${TimeHelper.displayTime(this.session.startTime!)} - ${TimeHelper.displayTime(this.session.endTime!)}`;
  }

  getStatusBadge(){
    return StatusHelper.getStatusBadge(this.session.status);
  }

  onUpdate(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.edit'),
      () => {
        this.update.emit(this.session);
      },
      undefined,
      'fa fa-edit confirm-icon-edit'
    );
  }

  onCancel(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.cancel'),
      () => {
        this.cancel.emit(this.session);
      },
      undefined,
      'pi pi-times confirm-icon-cancel'
    );
  }

  onRecordAttendance(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.recordAttendance'),
      () => {
        this.recordAttendance.emit(this.session);
      },
      undefined,
      'pi pi-check-circle confirm-icon-attendance'
    );
  }

  onMarkCompleted(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.markCompleted'),
      () => {
        this.markCompleted.emit(this.session);
      },
      undefined,
      'pi pi-check confirm-icon-completed'
    );
  }

  onReschedule(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.reschedule'),
      () => {
        this.reschedule.emit(this.session);
      },
      undefined,
      'fa fa-calendar-plus confirm-icon-reschedule'
    );
  }

  get permission() {
    return {
      canReschedule: this.permissionService.canEdit.session && this.session.status !== ClassSessionStatus.Scheduled,
      canMarkCompleted: this.permissionService.canEdit.session && this.session.status === ClassSessionStatus.Scheduled,
      canUpdate: this.permissionService.canEdit.session && this.session.status === ClassSessionStatus.Scheduled && this.validTimeBefore(30),
      canCancel: this.permissionService.canEdit.session && this.session.status === ClassSessionStatus.Scheduled && this.validTimeBefore(30),
      canRecordAttendance: this.permissionService.canEdit.attendance && this.session.status !== ClassSessionStatus.Cancelled,
    }
  }

  validTimeBefore(beforeTime: number) {
    // if the session date is in the future or today and the time is greater than the current time with 1 hour
    const sessionDate = new Date(this.session.date!);
    const currentDate = new Date();
    const currentTime = new Date().getHours() * 60 + new Date().getMinutes() + beforeTime;
    
    const sessionTimeParts = this.session.startTime!.split(':');
    const sessionTimeMinutes = parseInt(sessionTimeParts[0]) * 60 + parseInt(sessionTimeParts[1]);
    
    return sessionDate >= currentDate && sessionTimeMinutes > currentTime;
  }

} 