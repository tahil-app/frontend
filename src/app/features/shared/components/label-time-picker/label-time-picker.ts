import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'label-time-picker',
  imports: [DatePickerModule, FormsModule, CommonModule, ReactiveFormsModule, TranslateModule],
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
  @Input() placeholder: string = 'shared.timePicker.selectTime';
  
  private translate = inject(TranslateService);

  //#region Control Value Accessor
  innerValue: any = null;
  writeValue(value: any): void {
    this.innerValue = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }

  onInputChange(event: any): void {
    if (event && event.value) {
      this.innerValue = event.value;
      this.onChange(event.value);
    } else {
      this.innerValue = null;
      this.onChange(null);
    }
    this.onTouched();
  }

  onClear(): void {
    this.innerValue = null;
    this.onChange(null);
    this.onTouched();
  }

  onChange: any = () => { };
  onTouched: any = () => { };
  //#endregion

}
