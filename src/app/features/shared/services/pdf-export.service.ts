import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  private translateService: TranslateService = inject(TranslateService);

  /**
   * Export HTML element to PDF
   * @param element HTML element to export
   * @param filename Name of the PDF file
   * @param options Additional options for PDF generation
   */
  async exportToPdf(
    element: HTMLElement, 
    filename: string = 'export.pdf',
    options: {
      orientation?: 'portrait' | 'landscape';
      format?: 'a4' | 'a3' | 'letter';
      margin?: number;
      scale?: number;
    } = {}
  ): Promise<void> {
    try {
      const {
        orientation = 'portrait',
        format = 'a4',
        margin = 10,
        scale = 2
      } = options;

      // Create canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgWidth = format === 'a4' ? 210 : 297;
      const pageHeight = format === 'a4' ? 295 : 420;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF document
      const pdf = new jsPDF(orientation, 'mm', format);
      let position = margin;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth - (margin * 2), imgHeight);

      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth - (margin * 2), imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Export attendance sheet to PDF
   * @param element HTML element containing attendance data
   * @param sessionInfo Session information for filename
   */
  async exportAttendanceSheet(
    element: HTMLElement, 
    fileName: string
  ): Promise<void> {
    
    await this.exportToPdf(element, `${fileName}.pdf`, {
      orientation: 'portrait',
      format: 'a4',
      margin: 15,
      scale: 2
    });
  }
} 