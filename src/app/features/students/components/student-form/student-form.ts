import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { Student } from '../../../../core/models/student.model';
import { Subject, takeUntil } from 'rxjs';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { StudentService } from '../../../../core/services/student.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { DataHelper } from '../../../../core/helpers/data.helper';
import { UserRoleEnum } from '../../../../core/enums/user-role.enum';

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, DialogModule, SaveBtn, CancelBtn, InputTextModule, ReactiveFormsModule, InputLabel, LabelDatePicker, Dropdown],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss'
})
export class StudentFormComponent {

  //#region Properties
  @Input() showDialog = false;
  @Input() student: Student = {} as Student;
  studentForm!: FormGroup;
  destroy$ = new Subject<void>();
  requiredPassword = false;
  groupsOptions: DropdownProps[] = [];

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  genderOptions: DropdownProps[] = GenderHelper.getOptions();
  //#endregion

  //#region Services
  private studentService = inject(StudentService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private fb = inject(FormBuilder);
  //#endregion

  //#region Methods
  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['showDialog'] && (!this.student.id || this.student.id === 0)) {
      this.requiredPassword = true;
      this.studentForm?.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.studentForm?.get('confirmPassword')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.studentForm?.reset();
    }
    
    if (this.studentForm && changes['student'] && this.student.id > 0) {
      this.requiredPassword = false;
      
      this.studentForm.get('password')?.removeValidators([Validators.required, Validators.minLength(8)]);
      this.studentForm.get('confirmPassword')?.removeValidators([Validators.required, Validators.minLength(8)]);
      
      // Update validation state after removing validators
      this.studentForm.get('password')?.updateValueAndValidity();
      this.studentForm.get('confirmPassword')?.updateValueAndValidity();
      
      this.studentForm.patchValue(this.student);

      this.studentForm.get('joinedDate')?.setValue(new Date(this.student.joinedDate));
      this.studentForm.get('birthDate')?.setValue(new Date(this.student.birthDate));

      this.studentForm.markAllAsTouched();
    }

  }

  initForm() {
    this.studentForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['', [Validators.required]],
      joinedDate: [''],
      birthDate: [''],
      groups: [[]]
    });
  }

  hasId() {
    return this.studentForm.get('id')?.value;
  }

  getFormControl(name: string) {
    return this.studentForm.get(name) as FormControl;
  }

  save() {
    if (this.studentForm.get('password')?.value !== this.studentForm.get('confirmPassword')?.value) {
      this.toaster.showError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return;
    }

    if (this.studentForm.valid) {
      this.loader.show();

      const studentData = this.studentForm.value as Student;
      studentData.id = 0;
      studentData.role = UserRoleEnum.Student;
      studentData.joinedDate = DataHelper.toDate(studentData.joinedDate);
      studentData.birthDate = DataHelper.toDate(studentData.birthDate);

      this.studentService.add(studentData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.studentForm.reset();
            this.toaster.showSuccess('تم حفظ بيانات الطالب بنجاح');
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if (this.studentForm.valid) {
      this.loader.show();
      const studentData = { ...this.student, ...this.studentForm.value } as Student;
      studentData.joinedDate = DataHelper.toDate(studentData.joinedDate);
      studentData.birthDate = DataHelper.toDate(studentData.birthDate);

      this.studentService.update(studentData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.studentForm.reset();
            this.onSave.emit();
            this.toaster.showSuccess('تم تعديل بيانات الطالب بنجاح');
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.studentForm.reset();
    this.onCancel.emit();
  }

  onAdd() {
    this.studentForm.reset();
    this.studentForm.get('id')?.setValue(0);
    this.showDialog = true;
    // Ensure form validation is updated
    this.studentForm.updateValueAndValidity();
  }

  onEdit(event: Student) {
    this.studentForm.patchValue(event);
    this.showDialog = true;
    // Ensure form validation is updated after patching values
    this.studentForm.updateValueAndValidity();
  }

  onActivate(event: Student) {
    this.studentService.activate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess('تم تفعيل بيانات الطالب بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDeactivate(event: Student) {
    this.studentService.deactivate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess('تم تعطيل بيانات الطالب بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
