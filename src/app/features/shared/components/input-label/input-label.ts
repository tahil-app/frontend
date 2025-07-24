import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'input-label',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './input-label.html',
  styleUrl: './input-label.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputLabel),
      multi: true
    }
  ]
})
export class InputLabel implements ControlValueAccessor{

  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() formControl: FormControl = new FormControl();

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
