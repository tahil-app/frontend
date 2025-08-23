import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { PdfTemplateFooter } from "../../../shared/pdf-template/pdf-template-footer/pdf-template-footer";

@Component({
  selector: 'sessions-list-pdf-template',
  standalone: true,
  imports: [CommonModule, TranslateModule, PdfTemplateFooter],
  templateUrl: './sessions-list-pdf-template.component.html',
  styleUrls: ['./sessions-list-pdf-template.component.scss']
})
export class SessionsListPdfTemplateComponent {
  @Input() sessions: ClassSession[] = [];
  @Input() title: string = '';
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  ClassSessionStatus = ClassSessionStatus;

  exportDate = DateHelper.displayDate(new Date().toString());

  getFormattedDate(date: string | Date): string {
    return DateHelper.displayDate(date as string) || '-';
  }

  getFormattedTime(time: string): string {
    return TimeHelper.displayTime(time) || '-';
  }

  getStatusText(status: ClassSessionStatus): string {
    switch (status) {
      case ClassSessionStatus.Scheduled:
        return 'sessions.status.scheduled';
      case ClassSessionStatus.Completed:
        return 'sessions.status.completed';
      case ClassSessionStatus.Cancelled:
        return 'sessions.status.cancelled';
      default:
        return 'sessions.status.unknown';
    }
  }

  getStatusColor(status: ClassSessionStatus): string {
    switch (status) {
      case ClassSessionStatus.Scheduled:
        return 'text-primary';
      case ClassSessionStatus.Completed:
        return 'text-success';
      case ClassSessionStatus.Cancelled:
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }
} 