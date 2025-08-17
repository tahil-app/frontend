import { inject, Injectable } from "@angular/core";
import { DayOfWeek } from "../enums/day-week.enum";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

@Injectable({
  providedIn: 'root'
})
export class WeekDaysService {

  private translate = inject(TranslateService);

  getDayOptions(): DropdownProps[] {
    return [
      { label: this.translate.instant('shared.days.saturday'), value: DayOfWeek.Saturday },
      { label: this.translate.instant('shared.days.sunday'), value: DayOfWeek.Sunday },
      { label: this.translate.instant('shared.days.monday'), value: DayOfWeek.Monday },
      { label: this.translate.instant('shared.days.tuesday'), value: DayOfWeek.Tuesday },
      { label: this.translate.instant('shared.days.wednesday'), value: DayOfWeek.Wednesday },
      { label: this.translate.instant('shared.days.thursday'), value: DayOfWeek.Thursday },
      { label: this.translate.instant('shared.days.friday'), value: DayOfWeek.Friday }
    ];
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

}