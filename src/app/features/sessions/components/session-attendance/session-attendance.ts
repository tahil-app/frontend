import { Component, inject } from '@angular/core';
import { CardContainer } from "../../../shared/components/card-container/card-container";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { StudentAttendance, StudentAttendanceDisplay } from '../../../../core/models/student-attendance.model';
import { AttendanceStatus } from '../../../../core/enums/attendance-status.enum';
import { LoaderService } from '../../../shared/services/loader.service';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';
import { CanDeactivateComponent } from '../../../../core/guards/form-deactivate.guard';

@Component({
  selector: 'app-session-attendance',
  imports: [
    CardContainer, 
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    RadioButtonModule,
    SaveBtn,
    CancelBtn,
    RouterLink
  ],
  templateUrl: './session-attendance.html',
  styleUrl: './session-attendance.scss'
})
export class SessionAttendance implements CanDeactivateComponent {

  //#region Properties
  session: ClassSession = {} as ClassSession;
  attendanceDisplay: StudentAttendanceDisplay = {} as StudentAttendanceDisplay;
  attendanceForm!: FormGroup;
  AttendanceStatus = AttendanceStatus;
  ClassSessionStatus = ClassSessionStatus;
  $destroy = new Subject<void>();
  //#endregion

  //#region Services
  private attendanceService: AttendanceService = inject(AttendanceService);
  private loaderService: LoaderService = inject(LoaderService);
  private translateService: TranslateService = inject(TranslateService);
  private toastService: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  private route = inject(ActivatedRoute);
  private confirmService: ConfirmService = inject(ConfirmService);
  private fb: FormBuilder = inject(FormBuilder);
  public permissionService: PermissionAccessService = inject(PermissionAccessService);
  //#endregion

  //#region Methods 

  constructor() {
    this.initializeForm();

    this.route.params.subscribe(params => {
      this.session.id = +params['sessionId'];
      this.loadSessions();
    });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  initializeForm() {
    this.attendanceForm = this.fb.group({
      attendances: this.fb.array([])
    });
  }

  loadSessions() {
    this.loaderService.show();

    this.attendanceService.getAttendances(this.session.id).pipe(takeUntil(this.$destroy)).subscribe(res => {

      this.attendanceDisplay = res;
      this.attendanceDisplay.sessionDate = DateHelper.displayDate(res.sessionDate);
      this.attendanceDisplay.startTime = TimeHelper.displayTime(res.startTime);
      this.attendanceDisplay.endTime = TimeHelper.displayTime(res.endTime);

      this.buildAttendanceForm(res.attendances);

    }, err => {
    }, () => this.loaderService.hide());
  }

  buildAttendanceForm(attendances: StudentAttendance[]) {
    const attendancesArray = this.attendanceForm.get('attendances') as FormArray;
    attendancesArray.clear();

    attendances.forEach(attendance => {
      const attendanceGroup = this.fb.group({
        id: [attendance.id],
        sessionId: [attendance.sessionId],
        studentId: [attendance.studentId],
        studentName: [attendance.studentName],
        status: [attendance.status],
        note: [attendance.note || '']
      });
      attendancesArray.push(attendanceGroup);
    });

    this.attendanceForm.markAsPristine();
  }

  onSave() {
    this.confirmService.confirm(
      this.translateService.instant('attendance.confirm.save'),
      () => {
        
        this.loaderService.show();
        const formValue = this.attendanceForm.value;
        this.attendanceService.updateAttendances(this.session.id, formValue.attendances).pipe(takeUntil(this.$destroy)).subscribe(res => {

          if (res) {
            this.toastService.showSuccess(this.translateService.instant('attendance.updateSuccess'));
            this.attendanceForm.markAsPristine();
            this.loadSessions();
          }

        }, err => {}, () => this.loaderService.hide());

      }
    );
  }

  onCancel() {
    this.router.navigate(["sessions"]);
  }

  getFormControlArray() {
    return this.attendanceForm.get('attendances') as FormArray;
  }

  //#endregion

  //#region Mark All Attendances

  markAllPresent() {
    const attendancesArray = this.attendanceForm.get('attendances') as FormArray;
    attendancesArray.controls.forEach(control => {
      control.patchValue({ status: AttendanceStatus.Present });
    });
    this.attendanceForm.markAsDirty();
  }

  markAllAbsent() {
    const attendancesArray = this.attendanceForm.get('attendances') as FormArray;
    attendancesArray.controls.forEach(control => {
      control.patchValue({ status: AttendanceStatus.Absent });
    });
    this.attendanceForm.markAsDirty();
  }

  markAllLate() {
    const attendancesArray = this.attendanceForm.get('attendances') as FormArray;
    attendancesArray.controls.forEach(control => {
      control.patchValue({ status: AttendanceStatus.Late });
    });
    this.attendanceForm.markAsDirty();
  }

  //#endregion

  //#region Permissions

  get canEditAttendance(): boolean {
    return this.permissionService.canEdit.studentAttendance && this.attendanceDisplay.sessionStatus === ClassSessionStatus.Scheduled;
  }

  get dirty(): boolean {
    return this.attendanceForm?.dirty || false;
  }

  //#endregion

  //#region Summary Computed Properties
  
  get attendancesArray(): FormArray {
    return this.attendanceForm?.get('attendances') as FormArray || this.fb.array([]);
  }

  get totalStudents(): number {
    return this.attendancesArray?.length || 0;
  }

  get presentStudents(): number {
    if (!this.attendancesArray?.controls) return 0;
    return this.attendancesArray.controls.filter(control => 
      control.get('status')?.value === AttendanceStatus.Present
    ).length;
  }

  get lateStudents(): number {
    if (!this.attendancesArray?.controls) return 0;
    return this.attendancesArray.controls.filter(control => 
      control.get('status')?.value === AttendanceStatus.Late
    ).length;
  }

  get absentStudents(): number {
    if (!this.attendancesArray?.controls) return 0;
    return this.attendancesArray.controls.filter(control => 
      control.get('status')?.value === AttendanceStatus.Absent
    ).length;
  }

  //#endregion
}
