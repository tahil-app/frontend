import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { Teacher } from '../../../../core/models/teacher.model';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { UserRoleEnum } from '../../../../core/enums/user-role.enum';
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { GenderEnum } from '../../../../core/enums/gender.enum';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { GenderHelper } from '../../../../core/helpers/gender.helper';

@Component({
  selector: 'app-teacher-form',
  imports: [CommonModule, DialogModule, SaveBtn, CancelBtn, InputTextModule, ReactiveFormsModule, InputLabel, LabelDatePicker, Dropdown],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.scss'
})
export class TeacherFormComponent {

  //#region Properties
  @Input() showDialog = false;
  @Input() teacher: Teacher = {} as Teacher;
  teacherForm!: FormGroup;
  destroy$ = new Subject<void>();
  requiredPassword = false;

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  genderOptions: DropdownProps[] = GenderHelper.getOptions();
  //#endregion

  //#region Services
  private teacherService = inject(TeacherService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private fb = inject(FormBuilder);
  //#endregion

  //#region Methods
  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['showDialog'] && (!this.teacher.id || this.teacher.id === 0)) {
      this.requiredPassword = true;
      this.teacherForm?.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.teacherForm?.get('confirmPassword')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.teacherForm?.reset();
    }
    
    if (this.teacherForm && changes['teacher'] && this.teacher.id > 0) {
      this.requiredPassword = false;
      
      this.teacherForm.get('password')?.removeValidators([Validators.required, Validators.minLength(8)]);
      this.teacherForm.get('confirmPassword')?.removeValidators([Validators.required, Validators.minLength(8)]);
      
      // Update validation state after removing validators
      this.teacherForm.get('password')?.updateValueAndValidity();
      this.teacherForm.get('confirmPassword')?.updateValueAndValidity();
      
      this.teacherForm.patchValue(this.teacher);

      this.teacherForm.get('joinedDate')?.setValue(new Date(this.teacher.joinedDate));
      this.teacherForm.get('birthDate')?.setValue(new Date(this.teacher.birthDate));

      this.teacherForm.markAllAsTouched();
    }

  }

  initForm() {
    this.teacherForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['', [Validators.required]],
      joinedDate: [''],
      birthDate: ['']
    });
  }

  hasId() {
    return this.teacherForm.get('id')?.value;
  }

  getFormControl(name: string) {
    return this.teacherForm.get(name) as FormControl;
  }

  save() {
    if (this.teacherForm.get('password')?.value !== this.teacherForm.get('confirmPassword')?.value) {
      this.toaster.showError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return;
    }

    if (this.teacherForm.valid) {
      this.loader.show();

      const teacherData = this.teacherForm.value as Teacher;
      teacherData.id = 0;
      teacherData.role = UserRoleEnum.Teacher;
      teacherData.joinedDate = DateHelper.toDate(teacherData.joinedDate);
      teacherData.birthDate = DateHelper.toDate(teacherData.birthDate);

      this.teacherService.add(teacherData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.teacherForm.reset();
            this.toaster.showSuccess('تم حفظ بيانات المعلم بنجاح');
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if (this.teacherForm.valid) {
      this.loader.show();
      const teacherData = { ...this.teacher, ...this.teacherForm.value } as Teacher;
      teacherData.joinedDate = DateHelper.toDate(teacherData.joinedDate);
      teacherData.birthDate = DateHelper.toDate(teacherData.birthDate);

      this.teacherService.update(teacherData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.teacherForm.reset();
            this.onSave.emit();
            this.toaster.showSuccess('تم تعديل بيانات المعلم بنجاح');
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.teacherForm.reset();
    this.onCancel.emit();
  }

  onAdd() {
    this.teacherForm.reset();
    this.teacherForm.get('id')?.setValue(0);
    this.showDialog = true;
    // Ensure form validation is updated
    this.teacherForm.updateValueAndValidity();
  }

  onEdit(event: Teacher) {
    this.teacherForm.patchValue(event);
    this.showDialog = true;
    // Ensure form validation is updated after patching values
    this.teacherForm.updateValueAndValidity();
  }

  onActivate(event: Teacher) {
    this.teacherService.activate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess('تم تفعيل بيانات المعلم بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDeactivate(event: Teacher) {
    this.teacherService.deactivate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess('تم تعطيل بيانات المعلم بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
