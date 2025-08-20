import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class MonthesService {

  private translate = inject(TranslateService);

  getMonthes(): string[] {
    return [
      this.translate.instant('shared.months.january'),
      this.translate.instant('shared.months.february'),
      this.translate.instant('shared.months.march'),
      this.translate.instant('shared.months.april'),
      this.translate.instant('shared.months.may'),
      this.translate.instant('shared.months.june'),
      this.translate.instant('shared.months.july'),
      this.translate.instant('shared.months.august'),
      this.translate.instant('shared.months.september'),
      this.translate.instant('shared.months.october'),
      this.translate.instant('shared.months.november'),
      this.translate.instant('shared.months.december'),
    ];
  }

  getMonthName(month: number): string {
    const monthNames: { [key in number]: string } = {
      [1]: this.translate.instant('shared.months.january'),
      [2]: this.translate.instant('shared.months.february'),
      [3]: this.translate.instant('shared.months.march'),
      [4]: this.translate.instant('shared.months.april'),
      [5]: this.translate.instant('shared.months.may'),
      [6]: this.translate.instant('shared.months.june'),
      [7]: this.translate.instant('shared.months.july'),
      [8]: this.translate.instant('shared.months.august'),
      [9]: this.translate.instant('shared.months.september'),
      [10]: this.translate.instant('shared.months.october'),
      [11]: this.translate.instant('shared.months.november'),
    };
    return monthNames[month] || '';
  }
}