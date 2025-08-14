import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, OnInit, OnDestroy, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { ClassSession } from '../../../../core/models/class-session.model';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';
import { SessionService } from '../../../../core/services/session.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

// Shared Components
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { LabelTimePicker } from '../../../shared/components/label-time-picker/label-time-picker';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'session-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    TranslateModule,
    LabelDatePicker,
    LabelTimePicker,
    Dropdown,
    SaveBtn,
    CancelBtn
  ],
  templateUrl: './session-form.html',
  styleUrl: './session-form.scss'
})
export class SessionForm implements OnInit, OnDestroy {
  @Input() showDialog = false;
  @Input() session: ClassSession | null = null;

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  sessionForm!: FormGroup;
  statusOptions: DropdownProps[] = [];
  teachersOptions: DropdownProps[] = [];
  roomsOptions: DropdownProps[] = [];
  coursesOptions: DropdownProps[] = [];
  groupsOptions: DropdownProps[] = [];
  destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private loader = inject(LoaderService);
  private confirmService = inject(ConfirmService);
  private translateService = inject(TranslateService);
  private cd = inject(ChangeDetectorRef);
  private toaster = inject(ToastService);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.initStatusOptions();
    this.loadDropdownOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog) {
      this.sessionForm.reset();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.sessionForm = this.fb.group({
      id: [0],
      date: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      teacherId: [0, Validators.required],
      roomId: [0, Validators.required],
    });
  }

  private initStatusOptions() {
    this.statusOptions = [
      { label: this.translateService.instant('sessions.status.scheduled'), value: ClassSessionStatus.Scheduled },
      { label: this.translateService.instant('sessions.status.completed'), value: ClassSessionStatus.Completed },
      { label: this.translateService.instant('sessions.status.cancelled'), value: ClassSessionStatus.Cancelled }
    ];
  }

  private loadDropdownOptions() {
    this.loader.show();

    this.sessionService.getLookups(this.session!.courseId!).pipe(takeUntil(this.destroy$)).subscribe(lookups => {
      this.teachersOptions = lookups.teachers.map(teacher => ({ label: teacher.name, value: teacher.id }));
      this.roomsOptions = lookups.rooms.map(room => ({ label: room.name, value: room.id }));

      this.cd.detectChanges();

      const sessionForForm = { ...this.session } as any;
      if (sessionForForm.startTime && typeof sessionForForm.startTime === 'string') {
        sessionForForm.startTime = TimeHelper.toDate(sessionForForm.startTime);
      }
      if (sessionForForm.endTime && typeof sessionForForm.endTime === 'string') {
        sessionForForm.endTime = TimeHelper.toDate(sessionForForm.endTime);
      }

      if (sessionForForm.date && typeof sessionForForm.date === 'string') {
        sessionForForm.date = new Date(sessionForForm.date);
      }

      this.sessionForm.patchValue(sessionForForm);

    }, error => {}, () => this.loader.hide());

  }

  getFormControl(controlName: string): FormControl {
    return this.sessionForm.get(controlName) as FormControl;
  }

  hasId(): boolean {
    return this.sessionForm.get('id')?.value > 0;
  }

  save() {
    if (this.sessionForm.valid) {
      const sessionData: ClassSession = {...this.sessionForm.value};

      sessionData.scheduleId = this.session!.scheduleId;
      sessionData.date = sessionData.date ? DateHelper.toDate(sessionData.date) : null;
      sessionData.startTime = sessionData.startTime ? TimeHelper.toTime(sessionData.startTime) : '';
      sessionData.endTime = sessionData.endTime ? TimeHelper.toTime(sessionData.endTime) : '';

      this.loader.show();
      this.sessionService.updateSession(sessionData).pipe(
        takeUntil(this.destroy$)
      ).subscribe(res => {
        if (res) {
          this.toaster.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
          this.onSave.emit();
        }
      }, error => {}, () => this.loader.hide());
    }
  }

  cancel() {
    if (this.sessionForm.dirty) {
      this.confirmService.confirm(
        this.translateService.instant('shared.confirm.unsavedChanges'),
        () => {
          this.onCancel.emit();
        }
      );
    } else {
      this.onCancel.emit();
    }
  }
}
