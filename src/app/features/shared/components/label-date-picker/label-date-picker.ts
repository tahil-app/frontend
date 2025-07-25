import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'label-date-picker',
  imports: [DatePickerModule, FormsModule],
  templateUrl: './label-date-picker.html',
  styleUrl: './label-date-picker.scss'
})
export class LabelDatePicker  {
  date: Date | undefined;
}
