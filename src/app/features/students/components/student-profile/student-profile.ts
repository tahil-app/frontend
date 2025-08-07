import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { StudentFormComponent } from '../student-form/student-form';
import { StudentQualification } from '../student-qualification/student-qualification';
import { CommonModule } from '@angular/common';
import { UserAttachmentDialog } from '../../../shared/components/user-attachment-dialog/user-attachment-dialog';
import { StudentAttachmentComponent } from '../student-attachment/student-attachment';
import { Student } from '../../../../core/models/student.model';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { StudentService } from '../../../../core/services/student.service';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { GenderEnum } from '../../../../core/enums/gender.enum';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { UserAttachment } from '../../../../core/models/user-attachment.model';
import { Group } from '../../../../core/models/group.model';
import { TableModule } from 'primeng/table';
import { GroupsDialog } from '../../../shared/dialogs/groups-dialog/groups-dialog';

@Component({
  selector: 'app-student-profile',
  imports: [CardContainer, TabsModule, TooltipModule, StudentFormComponent, StudentQualification, CommonModule, UserAttachmentDialog, StudentAttachmentComponent, GroupsDialog,
    TableModule
  ],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.scss'
})
export class StudentProfile {

  //#region Properties
  showEditInfoDialog = false;
  showQualificationDialog = false;
  showUserAttachmentDialog = false;
  showGroupsDialog = false;
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
      this.student = student;

      if(student.id == 0) {
        this.toaster.showError('لا يوجد معلومات عن الطالب');
        this.disablePage = true;
      }

      this.cdr.detectChanges();
    }, _ => { }, () => {
      this.loader.hide();
      this.showEditInfoDialog = false;
      this.showQualificationDialog = false;
      this.showUserAttachmentDialog = false;
      this.showGroupsDialog = false;
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

  //#region Teacher Info

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
          this.toaster.showSuccess('تم تحديث الصورة بنجاح');
        }
      }, _ => { }, () => {
        this.loader.hide();
      }, );
    }
  }

  getAge(birthDate: string) {
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

  //#region Groups

  onEditGroups() {
    this.showGroupsDialog = true;
  }

  saveGroups(groups: Group[]) {

    this.student.groups = groups;

    this.loader.show();
    this.studentService.update(this.student).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res) {
        this.loadStudent();
        this.toaster.showSuccess('تم تحديث المجموعات بنجاح');
      }
    }, _ => { }, () => {
      this.loader.hide();
      this.showGroupsDialog = false;
    });

  }

  //#endregion

}

