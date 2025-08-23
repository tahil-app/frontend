import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PdfTemplateFooter } from '../pdf-template-footer/pdf-template-footer';
import { TranslateModule } from '@ngx-translate/core';
import { PdfTemplateHeader } from '../pdf-template-header/pdf-template-header';
import { Feedback } from '../../../../core/models/feedback.model';
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'feedback-pdf-template',
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader],
  templateUrl: './feedback-pdf-template.html',
  styleUrl: './feedback-pdf-template.scss'
})
export class FeedbackPdfTemplate {
  @Input() title: string = '';
  @Input() feedbacks: Feedback[] = [];

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  exportDate = DateHelper.displayDate(new Date().toString());


  getDate(date: string): string {
    return DateHelper.displayDate(date) || '-';
  }



}

