import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'label-date-picker',
  imports: [DatePickerModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './label-date-picker.html',
  styleUrl: './label-date-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabelDatePicker),
      multi: true
    }
  ]
})
export class LabelDatePicker  {
  
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() formControl: FormControl = new FormControl();

  date: Date | undefined;

  //#region Control Value Accessor
  innerValue: any;
  writeValue(value: any): void {
    this.innerValue = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn ?? this.onChange;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn ?? this.onTouched;
  }
  setDisabledState(isDisabled: boolean): void {
    // this.disabled = isDisabled;
  }

  onInputChange(event: any): void {
    this.innerValue = event.target.value;
    this.onChange(this.innerValue);
  }

  onChange: any = () => { };
  onTouched: any = () => { };
  //#endregion

}
