import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ClassSessionStatus } from "../enums/class-session-status.enum";
import { DropdownProps } from "../../features/shared/props/dropdown.props";
import { ClassScheduleStatus } from "../enums/class-schedule-status.enum";

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private translateService = inject(TranslateService);

  getSessionStatusName(status: ClassSessionStatus): string {
    return this.getSessionStatusOptions().find(r => r.value == status)?.label || '';
  }

  getSessionStatusOptions(): DropdownProps[] {
    return [
      { value: ClassSessionStatus.Scheduled, label: this.translateService.instant('sessions.status.scheduled') },
      { value: ClassSessionStatus.Completed, label: this.translateService.instant('sessions.status.completed') },
      { value: ClassSessionStatus.Cancelled, label: this.translateService.instant('sessions.status.cancelled') }
    ];
  }

  getSessionStatusBadge(status: ClassSessionStatus): { value: string; severity: 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' } {
    switch (status) {
      case ClassSessionStatus.Scheduled:
        return { value: 'sessions.status.scheduled', severity: 'info' };
      case ClassSessionStatus.Completed:
        return { value: 'sessions.status.completed', severity: 'success' };
      case ClassSessionStatus.Cancelled:
        return { value: 'sessions.status.cancelled', severity: 'danger' };
      default:
    }
    return { value: 'sessions.status.unknown', severity: 'secondary' };
  }

  getScheduleStatusName(status: ClassScheduleStatus): string {
    const statusNames: { [key in ClassScheduleStatus]: string } = {
      [ClassScheduleStatus.New]: this.translateService.instant('schedules.status.new'),
      [ClassScheduleStatus.Active]: this.translateService.instant('schedules.status.active'),
      [ClassScheduleStatus.Paused]: this.translateService.instant('schedules.status.paused'),
      [ClassScheduleStatus.Completed]: this.translateService.instant('schedules.status.completed'),
      [ClassScheduleStatus.Cancelled]: this.translateService.instant('schedules.status.cancelled')
    };
    return statusNames[status] || '';
  }

  getScheduleStatusClassName(status: ClassScheduleStatus): string {
    const statusClasses: { [key in ClassScheduleStatus]: string } = {
      [ClassScheduleStatus.New]: 'status-new',
      [ClassScheduleStatus.Active]: 'status-active',
      [ClassScheduleStatus.Paused]: 'status-paused',
      [ClassScheduleStatus.Completed]: 'status-completed',
      [ClassScheduleStatus.Cancelled]: 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

}
