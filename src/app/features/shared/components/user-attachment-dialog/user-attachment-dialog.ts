import { Component, EventEmitter, forwardRef, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Subject } from 'rxjs';
import { CancelBtn } from '../../buttons/cancel-btn/cancel-btn';
import { SaveBtn } from '../../buttons/save-btn/save-btn';
import { InputLabel } from "../input-label/input-label";
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { UserAttachment } from '../../../../core/models/user-attachment.model';

@Component({
  selector: 'user-attachment-dialog',
  imports: [DialogModule, ReactiveFormsModule, SaveBtn, CancelBtn, InputLabel, FileUploadModule, InputLabel, CommonModule],
  templateUrl: './user-attachment-dialog.html',
  styleUrl: './user-attachment-dialog.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserAttachmentDialog),
      multi: true
    }
  ]
})
export class UserAttachmentDialog {

  //#region Properties
  @Input() showDialog = false;
  @Input() userId: number = 0;

  formControl = new FormControl();
  userAttachmentForm!: FormGroup;
  @ViewChild(FileUpload) fileUpload!: FileUpload;

  @Output() onSave = new EventEmitter<UserAttachment>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private fb = inject(FormBuilder);
  //#endregion

  //#region Methods

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userAttachmentForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      file: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog == true) {
      this.userAttachmentForm.reset();
      
      if (this.fileUpload) {
        this.fileUpload.clear();
      }
    }
  }

  getFormControl(controlName: string) {
    return this.userAttachmentForm.get(controlName) as FormControl;
  }

  save() {
    if (this.userAttachmentForm.valid) {
      this.onSave.emit({
        ...this.userAttachmentForm.value,
        userId: this.userId
      });
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.userAttachmentForm.patchValue({
        file: event.files[0]
      });
    }
  }

  //#endregion

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

  onChange: any = () => { };
  onTouched: any = () => { };
  //#endregion


}
