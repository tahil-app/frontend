import { Component, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Feedback } from '../../../../core/models/feedback.model';
import { CardFeedback } from "../../../shared/components/card-feedback/card-feedback";
import { NoData } from "../../../shared/components/no-data/no-data";
import { PdfIconBtn } from "../../../shared/buttons/pdf-icon-btn/pdf-icon-btn";
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { FeedbackPdfTemplate } from "../../../shared/pdf-template/feedback-pdf-template/feedback-pdf-template";
import { Student } from '../../../../core/models/student.model';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { LoaderService } from '../../../shared/services/loader.service';
import { PdfExportService } from '../../../shared/services/pdf-export.service';
import { ReportHelper } from '../../../../core/helpers/report.helper';

@Component({
  selector: 'student-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    RatingModule,
    BadgeModule,
    ButtonModule,
    ProgressSpinnerModule,
    TranslateModule,
    CardFeedback,
    NoData,
    PdfIconBtn,
    FeedbackPdfTemplate
],
  templateUrl: './student-feedback.html',
  styleUrl: './student-feedback.scss'
})
export class StudentFeedback {
  
  @Input() student: Student = {} as Student;
  @Input() feedbacks: Feedback[] = [];

  allowExportToPdf: boolean = false;
  @ViewChild(FeedbackPdfTemplate, { static: false }) pdfTemplate!: FeedbackPdfTemplate;


  private confirmService = inject(ConfirmService);
  private loader = inject(LoaderService);
  private pdfExportService = inject(PdfExportService);
  private translate = inject(TranslateService);
  public permissionService = inject(PermissionAccessService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feedbacks']) {
      this.feedbacks = changes['feedbacks'].currentValue ?? [];
      this.feedbacks = this.feedbacks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  getReportTitle() {
    return ReportHelper.getTitle(this.translate.instant('shared.tabs.teacherFeedback'), this.student.name);
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

        const filename = `${this.student.name}_Feedback_Report.pdf`;

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
