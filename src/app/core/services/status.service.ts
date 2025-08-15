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
}
