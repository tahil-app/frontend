import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ClassSessionStatus } from "../enums/class-session-status.enum";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

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
}
