import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TranslateModule } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { StatusHelper } from '../../../../core/helpers/status.helper';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';

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

  getFormattedDate(): string {
    if (!this.session.date) return '-';
    return new Date(this.session.date).toLocaleDateString();
  }

  getFormattedTime(): string {
    return `${TimeHelper.getTime(this.session.startTime!)} - ${TimeHelper.getTime(this.session.endTime!)}`;
  }

  getStatusBadge(){
    return StatusHelper.getStatusBadge(this.session.status);
  }

  onUpdate(): void {
    this.update.emit(this.session);
  }

  onCancel(): void {
    this.cancel.emit(this.session);
  }

  onRecordAttendance(): void {
    this.recordAttendance.emit(this.session);
  }

  onMarkCompleted(): void {
    this.markCompleted.emit(this.session);
  }

  onReschedule(): void {
    this.reschedule.emit(this.session);
  }
} 