import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'label-time-picker',
  imports: [DatePickerModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './label-time-picker.html',
  styleUrl: './label-time-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabelTimePicker),
      multi: true
    }
  ]
})
export class LabelTimePicker implements ControlValueAccessor {
  
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';

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
    this.innerValue = event;
    this.onChange(this.innerValue);
    this.onTouched();
  }

  onChange: any = () => { };
  onTouched: any = () => { };
  //#endregion

}
