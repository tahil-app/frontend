import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { EnvironmentHelper } from '../../../../core/helpers/environment-helper';

@Component({
  selector: 'pdf-template-footer',
  imports: [
    TranslateModule
  ],
  templateUrl: './pdf-template-footer.html',
  styleUrl: './pdf-template-footer.scss'
})
export class PdfTemplateFooter {

  exportDate = DateHelper.displayDate(new Date().toString());

  get exportBy() {
    return EnvironmentHelper.APP_NAME;
  }

}
