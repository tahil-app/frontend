import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { MonthesService } from '../../../../core/services/monthes.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DailyAttendanceModel } from '../../../../core/models/daily-attendance.model';
import { PdfTemplateHeader } from '../pdf-template-header/pdf-template-header';
import { PdfTemplateFooter } from '../pdf-template-footer/pdf-template-footer';
import { CommonModule } from '@angular/common';
import { AttendanceStatus } from '../../../../core/enums/attendance-status.enum';
import { NoData } from "../../components/no-data/no-data";
import { StatusService } from '../../../../core/services/status.service';
import { TimeHelper } from '../../../../core/helpers/time.helper';

@Component({
  selector: 'attendace-daily-pdf-template',
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader, PdfTemplateHeader, NoData],
  templateUrl: './attendace-daily-pdf-template.html',
  styleUrl: './attendace-daily-pdf-template.scss'
})
export class AttendaceDailyPdfTemplate {
  @Input() title: string = '';
  @Input() dailyAttendanceData: DailyAttendanceModel[] = [];
  @Input() selectedYear: number = new Date().getFullYear();
  @Input() selectedMonth: number = 0;
  @Input() showComment: boolean = false;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  exportDate = DateHelper.displayDate(new Date().toString());
  private translateService = inject(TranslateService);
  private monthService = inject(MonthesService);
  public statusService = inject(StatusService);


  get dailyStatistics() {
    return {
      present: this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).present,
      late: this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).late,
      absent: this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).absent,
      total: this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).total,
      percentage: this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).percentage
    };
  }

  getMonthName(): string {
    return this.monthService.getMonthName(this.selectedMonth);
  }

  getDate(date: string): string {
    return DateHelper.displayDate(date) || '';
  }

  getTime(startTime: string | null, endTime: string | null) {
    return `${TimeHelper.displayTime(startTime)} - ${TimeHelper.displayTime(endTime)}`;
  }

}

