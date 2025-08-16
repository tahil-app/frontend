import { Component, inject, OnInit } from '@angular/core';
import { CardContainer } from "../../../shared/components/card-container/card-container";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { StudentAttendance, StudentAttendanceDisplay } from '../../../../core/models/student-attendance.model';
import { Student } from '../../../../core/models/student.model';
import { AttendanceStatus } from '../../../../core/enums/attendance-status.enum';
import { LoaderService } from '../../../shared/services/loader.service';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-session-attendance',
  imports: [
    CardContainer, 
    TranslateModule,
    CommonModule,
    FormsModule,
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
export class SessionAttendance implements OnInit {

  //#region Properties
  session: ClassSession = {} as ClassSession;
  attendanceDisplay: StudentAttendanceDisplay = {} as StudentAttendanceDisplay;
  attendanceRecords: StudentAttendance[] = [];
  students: Student[] = [];
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
  public permissionService: PermissionAccessService = inject(PermissionAccessService);
  //#endregion

  //#region Methods 

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.session.id = +params['sessionId'];
      this.loadSessions();
    });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  loadSessions() {
    this.loaderService.show();

    this.attendanceService.getAttendances(this.session.id).pipe(takeUntil(this.$destroy)).subscribe(res => {

      this.attendanceDisplay = res;
      this.attendanceDisplay.sessionDate = DateHelper.displayDate(res.sessionDate);
      this.attendanceDisplay.startTime = TimeHelper.displayTime(res.startTime);
      this.attendanceDisplay.endTime = TimeHelper.displayTime(res.endTime);
      
      this.attendanceRecords = res.attendances;
      
    }, err => {}, () => this.loaderService.hide());
  }

  onSave() {
    this.confirmService.confirm(
      this.translateService.instant('attendance.confirm.save'),
      () => {
        
        this.loaderService.show();
        this.attendanceService.updateAttendances(this.session.id, this.attendanceRecords).pipe(takeUntil(this.$destroy)).subscribe(res => {

          if (res) {
            this.toastService.showSuccess(this.translateService.instant('attendance.updateSuccess'));
            this.loadSessions();
          }


        }, err => {}, () => this.loaderService.hide());

      }
    );

  }

  onCancel() {

    this.confirmService.confirm(
      this.translateService.instant('attendance.confirm.cancel'),
      () => {
        this.router.navigate(["sessions"]);
      }
    );

  }

  markAllPresent() {
    this.attendanceRecords.forEach(record => record.status = AttendanceStatus.Present);
  }

  markAllAbsent() {
    this.attendanceRecords.forEach(record => record.status = AttendanceStatus.Absent);
  }

  markAllLate() {
    this.attendanceRecords.forEach(record => record.status = AttendanceStatus.Late);
  }

  // Computed properties for template
  get totalStudents(): number {
    return this.attendanceRecords.length;
  }

  get presentStudents(): number {
    return this.attendanceRecords.filter(r => r.status === AttendanceStatus.Present).length;
  }

  get lateStudents(): number {
    return this.attendanceRecords.filter(r => r.status === AttendanceStatus.Late).length;
  }

  get absentStudents(): number {
    return this.attendanceRecords.filter(r => r.status === AttendanceStatus.Absent).length;
  }

  get canEditAttendance(): boolean {
    return this.permissionService.canEdit.studentAttendance && this.attendanceDisplay.sessionStatus === ClassSessionStatus.Scheduled;
  }
  //#endregion
}
