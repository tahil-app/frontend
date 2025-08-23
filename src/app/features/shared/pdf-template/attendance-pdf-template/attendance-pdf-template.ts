import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PdfTemplateFooter } from '../pdf-template-footer/pdf-template-footer';
import { PdfTemplateHeader } from '../pdf-template-header/pdf-template-header';
import { MonthlyAttendanceModel } from '../../../../core/models/monthly-attendance.model';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { MonthesService } from '../../../../core/services/monthes.service';

@Component({
  selector: 'attendance-pdf-template',
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader],
  templateUrl: './attendance-pdf-template.html',
  styleUrl: './attendance-pdf-template.scss'
})
export class AttendancePdfTemplate {
  @Input() title: string = '';
  @Input() monthlyAttendanceData: MonthlyAttendanceModel[] = [];
  @Input() selectedYear: number = new Date().getFullYear();

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  exportDate = DateHelper.displayDate(new Date().toString());

  private translateService = inject(TranslateService);
  private monthService = inject(MonthesService);


  get present() {
    return this.monthlyAttendanceData.reduce((acc, curr) => acc + curr.present, 0);
  }

  get absent() {
    return this.monthlyAttendanceData.reduce((acc, curr) => acc + curr.absent, 0);
  }

  get late() {
    return this.monthlyAttendanceData.reduce((acc, curr) => acc + curr.late, 0);
  }

  get total() {
    return this.present + this.absent + this.late;
  }

  get attendancePercentage() {
    return this.total > 0 ? ((this.present / this.total) * 100).toFixed(1) : '0.0';
  }

  getMonthName(monthNumber: number): string {
    const months = this.monthService.getMonthes();
    return months[monthNumber - 1] || '';
  }

  getMonthData(monthNumber: number): MonthlyAttendanceModel | undefined {
    return this.monthlyAttendanceData.find(item => item.month === monthNumber);
  }

  getBestMonth(): string {
    if (this.monthlyAttendanceData.length === 0) return '-';
    
    // Filter months with actual attendance data
    const monthsWithData = this.monthlyAttendanceData.filter(month => 
      (month.present + month.late + month.absent) > 0
    );
    
    if (monthsWithData.length === 0) return '-';
    
    // If only one month has data, show it as the only month
    if (monthsWithData.length === 1) {
      return this.getMonthName(monthsWithData[0].month);
    }
    
    // Check if all months have the same percentage
    const percentages = monthsWithData.map(month => 
      month.total > 0 ? (month.present / month.total) * 100 : 0
    );
    const allSame = percentages.every(p => Math.abs(p - percentages[0]) < 0.1);
    
    if (allSame) {
      return this.translateService.instant('shared.allMonths');
    }
    
    const bestMonth = monthsWithData.reduce((best, current) => {
      const bestPercentage = best.total > 0 ? (best.present / best.total) * 100 : 0;
      const currentPercentage = current.total > 0 ? (current.present / current.total) * 100 : 0;
      return currentPercentage > bestPercentage ? current : best;
    });
    
    return this.getMonthName(bestMonth.month);
  }

  getWorstMonth(): string {
    if (this.monthlyAttendanceData.length === 0) return '-';
    
    // Filter months with actual attendance data
    const monthsWithData = this.monthlyAttendanceData.filter(month => 
      (month.present + month.late + month.absent) > 0
    );
    
    if (monthsWithData.length === 0) return '-';
    
    // If only one month has data, show it as the only month
    if (monthsWithData.length === 1) {
      return this.getMonthName(monthsWithData[0].month);
    }
    
    // Check if all months have the same percentage
    const percentages = monthsWithData.map(month => 
      month.total > 0 ? (month.present / month.total) * 100 : 0
    );
    const allSame = percentages.every(p => Math.abs(p - percentages[0]) < 0.1);
    
    if (allSame) {
      return this.translateService.instant('shared.allMonths');
    }
    
    const worstMonth = monthsWithData.reduce((worst, current) => {
      const worstPercentage = worst.total > 0 ? (worst.present / worst.total) * 100 : 0;
      const currentPercentage = current.total > 0 ? (current.present / current.total) * 100 : 0;
      return currentPercentage < worstPercentage ? current : worst;
    });
    
    return this.getMonthName(worstMonth.month);
  }

  getPerformanceRating(): string {
    const percentage = parseFloat(this.attendancePercentage);
    
    if (percentage >= 90) return this.translateService.instant('performance.excellent');
    if (percentage >= 80) return this.translateService.instant('performance.good');
    if (percentage >= 70) return this.translateService.instant('performance.average');
    if (percentage >= 60) return this.translateService.instant('performance.belowAverage');
    return this.translateService.instant('performance.poor');
  }

  getPerformanceClass(): string {
    const percentage = parseFloat(this.attendancePercentage);
    
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    if (percentage >= 60) return 'below-average';
    return 'poor';
  }
}

