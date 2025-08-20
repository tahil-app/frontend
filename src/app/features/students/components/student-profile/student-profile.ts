import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { StudentFormComponent } from '../student-form/student-form';
import { StudentQualification } from '../student-qualification/student-qualification';
import { CommonModule } from '@angular/common';
import { UserAttachmentDialog } from '../../../shared/dialogs/user-attachment-dialog/user-attachment-dialog';
import { StudentAttachmentComponent } from '../student-attachment/student-attachment';
import { Student } from '../../../../core/models/student.model';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { StudentService } from '../../../../core/services/student.service';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { GenderEnum } from '../../../../core/enums/gender.enum';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { UserAttachment } from '../../../../core/models/user-attachment.model';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { CardModule } from 'primeng/card';
import { EditIconButton } from "../../../shared/buttons/edit-icon-button/edit-icon-button";
import { StudentDailySchedule } from "../student-daily-schedule/student-daily-schedule";
import { StudentFeedback } from "../student-feedback/student-feedback";
import { StudentAttendance } from "../student-attendance/student-attendance";

@Component({
  selector: 'app-student-profile',
  imports: [
    TabsModule,
    TooltipModule,
    StudentFormComponent,
    StudentQualification,
    CommonModule,
    UserAttachmentDialog,
    StudentAttachmentComponent,
    TableModule,
    TranslateModule,
    RouterModule,
    CardModule,
    EditIconButton,
    StudentDailySchedule,
    StudentFeedback,
    StudentAttendance
],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.scss'
})
export class StudentProfile {

  //#region Properties
  showEditInfoDialog = false;
  showQualificationDialog = false;
  showUserAttachmentDialog = false;
  disablePage = false;

  student: Student = {} as Student;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private studentService = inject(StudentService);
  private loader = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  
  public permissionService = inject(PermissionAccessService);
  //#endregion

  //#region Methods

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.student.id = Number(params['id']);
      this.loadStudent();
    });

  }

  loadStudent() {
    this.loader.show();
    this.studentService.get(this.student.id).pipe(takeUntil(this.destroy$)).subscribe((student: Student) => {
      this.student = {...student};

      if(student.id == 0) {
        this.toaster.showError(this.translate.instant('students.notFound'));
        this.disablePage = true;
      }

      this.cdr.detectChanges();
    }, _ => { }, () => {
      this.loader.hide();
      this.showEditInfoDialog = false;
      this.showQualificationDialog = false;
      this.showUserAttachmentDialog = false;
    });
  }

  getSafeHtml(html: string) {
    return html ? this.sanitizer.bypassSecurityTrustHtml(html) : '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //#endregion

  //#region Student Info

  get selectedTab() {
    return this.permissionService.canView.studentSchedule ? '0' : '2';
  }

  getImageUrl(imageUrl: string) {
    return imageUrl ? this.studentService.getViewAttachmentUrl(imageUrl) : 'assets/icons/avatar-teacher.svg';
  }

  onUploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.loader.show();
      this.studentService.uploadImage(file, this.student.id).subscribe(res => {
        if(res) {
          this.loadStudent();
          this.toaster.showSuccess(this.translate.instant('students.imageUpdateSuccess'));
        }
      }, _ => { }, () => {
        this.loader.hide();
      }, );
    }
  }

  getAge(birthDate: string | null) {
    return birthDate ? DateHelper.getAge(birthDate) : '';
  }

  getGender(gender: GenderEnum) {
    return GenderHelper.get(gender);
  }

  onEditStudent() {
    this.student = { ...this.student };
    this.showEditInfoDialog = true;
  }

  //#endregion

  //#region Student Qualification

  onEditQualification() {
    this.student = { ...this.student };
    this.showQualificationDialog = true;
  }

  //#endregion

  //#region User Attachment

  onAddUserAttachment() {
    this.showUserAttachmentDialog = true;
  }

  saveUserAttachment(userAttachment: UserAttachment) {
    this.loader.show();
    this.studentService.uploadAttachment(userAttachment).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.loadStudent();
    }, _ => { }, () => {
      this.loader.hide();
      this.showUserAttachmentDialog = false;
    });
  }

  //#endregion


}

