import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray } from '@angular/forms';
import { StudentAttendanceDisplay } from '../../../../core/models/student-attendance.model';
import { AttendanceStatus } from '../../../../core/enums/attendance-status.enum';
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'attendance-pdf-template',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './attendance-pdf-template.component.html',
  styleUrls: ['./attendance-pdf-template.component.scss']
})
export class AttendancePdfTemplateComponent {
  @Input() attendanceDisplay!: StudentAttendanceDisplay;
  @Input() attendancesArray!: FormArray;
  @Input() totalStudents!: number;
  @Input() presentStudents!: number;
  @Input() lateStudents!: number;
  @Input() absentStudents!: number;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  AttendanceStatus = AttendanceStatus;

  exportDate = DateHelper.displayDate(new Date().toString());

  getFormControlArray(): FormArray {
    return this.attendancesArray;
  }
} 