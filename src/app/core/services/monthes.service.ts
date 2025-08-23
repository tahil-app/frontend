import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class MonthesService {

  private translate = inject(TranslateService);

  getMonthes(): string[] {
    return [
      this.translate.instant('months.january'),
      this.translate.instant('months.february'),
      this.translate.instant('months.march'),
      this.translate.instant('months.april'),
      this.translate.instant('months.may'),
      this.translate.instant('months.june'),
      this.translate.instant('months.july'),
      this.translate.instant('months.august'),
      this.translate.instant('months.september'),
      this.translate.instant('months.october'),
      this.translate.instant('months.november'),
      this.translate.instant('months.december'),
    ];
  }

  getMonthName(month: number): string {
    const monthNames: { [key in number]: string } = {
      [1]: this.translate.instant('months.january'),
      [2]: this.translate.instant('months.february'),
      [3]: this.translate.instant('months.march'),
      [4]: this.translate.instant('months.april'),
      [5]: this.translate.instant('months.may'),
      [6]: this.translate.instant('months.june'),
      [7]: this.translate.instant('months.july'),
      [8]: this.translate.instant('months.august'),
      [9]: this.translate.instant('months.september'),
      [10]: this.translate.instant('months.october'),
      [11]: this.translate.instant('months.november'),
    };
    return monthNames[month] || '';
  }
}