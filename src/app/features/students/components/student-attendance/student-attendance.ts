import { Component, OnInit, OnDestroy, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { PdfIconBtn } from "../../../shared/buttons/pdf-icon-btn/pdf-icon-btn";
import { MonthlyAttendanceModel } from '../../../../core/models/monthly-attendance.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { LineChart } from "../../../shared/components/line-chart/line-chart";
import { LineChartProps } from '../../../shared/props/line-chart.props';
import { StudentAttendancePdfTemplateComponent } from '../student-attendance-pdf-template/student-attendance-pdf-template';
import { PdfExportService } from '../../../shared/services/pdf-export.service';
import { Student } from '../../../../core/models/student.model';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

@Component({
  selector: 'student-attendance',
  imports: [
    CommonModule,
    CardModule,
    SelectModule,
    ButtonModule,
    TranslateModule,
    FormsModule,
    PdfIconBtn,
    LineChart,
    StudentAttendancePdfTemplateComponent
  ],
  templateUrl: './student-attendance.html',
  styleUrl: './student-attendance.scss'
})
export class StudentAttendance implements OnInit, OnDestroy {

  @Input() student!: Student;
  @ViewChild(StudentAttendancePdfTemplateComponent, { static: false }) pdfTemplate!: StudentAttendancePdfTemplateComponent;

  // Properties
  allowExportToPdf: boolean = false;
  monthlyAttendanceData: MonthlyAttendanceModel[] = [];
  dataSet: LineChartProps[] = [];

  // Filter options
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];

  $destroy = new Subject<void>();

  private loader = inject(LoaderService);
  private attendanceService = inject(AttendanceService);
  private translateService = inject(TranslateService);
  private pdfExportService = inject(PdfExportService);
  private confirmService = inject(ConfirmService);
  public permissionService = inject(PermissionAccessService);

  ngOnInit() {
    this.loadAttendanceData(this.selectedYear);

    this.years = Array.from({ length: 5 }, (_, i) => this.selectedYear - i);
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  initializeChart() {
    // Create a data array for all 12 months, initialized with 0
    const presentData = new Array(12).fill(0);
    const absentData = new Array(12).fill(0);
    const lateData = new Array(12).fill(0);

    // Map the API data to the correct month positions (month - 1 for array index)
    this.monthlyAttendanceData.forEach(item => {
      const monthIndex = item.month - 1; // Convert month number to array index
      if (monthIndex >= 0 && monthIndex < 12) {
        presentData[monthIndex] = item.present;
        absentData[monthIndex] = item.absent;
        lateData[monthIndex] = item.late;
      }
    });

    this.dataSet = [
      {
        label: this.translateService.instant('shared.attendanceStatus.present'),
        data: presentData,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#4CAF50',
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: this.translateService.instant('shared.attendanceStatus.absent'),
        data: absentData,
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#F44336',
        pointBorderColor: '#F44336',
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: this.translateService.instant('shared.attendanceStatus.late'),
        data: lateData,
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#FF9800',
        pointBorderColor: '#FF9800',
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }

  buildTooltipLabel = (context: any) => {
    const label = context.dataset.label || '';
    const value = context.parsed.y;
    const monthIndex = context.dataIndex;

    // Find the month data for this specific month
    const monthData = this.monthlyAttendanceData?.find(item => item.month === monthIndex + 1);

    // Calculate total from present + absent + late for this month
    const monthTotal = monthData ? (monthData.present + monthData.absent + monthData.late) : 0;
    const percentage = monthTotal > 0 ? ((value / monthTotal) * 100).toFixed(1) : '0.0';

    return `${label}: ${value} (${percentage}%)`;
  }

  onYearChange() {
    this.loadAttendanceData(this.selectedYear);
  }

  loadAttendanceData(year: number) {
    this.loader.show();

    this.attendanceService.getStudentMonthlyAttendance(year, this.student.id)
      .subscribe(res => {
        this.monthlyAttendanceData = res;
        this.initializeChart();
      }, err => { }, () => this.loader.hide());
  }

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

  async exportToPdf() {

    this.confirmService.confirmPrint(async () => {
      try {
        this.allowExportToPdf = true;

        this.loader.show();

        if (!this.pdfTemplate) {
          console.error('PDF template not found');
          return;
        }

        const filename = `${this.student.name}_Attendance_Report_${this.selectedYear}.pdf`;

        await this.pdfExportService.exportToPdf(
          this.pdfTemplate.pdfContent.nativeElement,
          filename,
          { orientation: 'portrait', format: 'a4' }
        );

      } catch (error) {
        console.error('Error exporting PDF:', error);
      } finally {
        this.loader.hide();
        this.allowExportToPdf = false;
      }
    });


  }
}
