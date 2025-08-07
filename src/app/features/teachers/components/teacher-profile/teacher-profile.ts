import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { TabsModule } from 'primeng/tabs';
import { Teacher } from '../../../../core/models/teacher.model';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { GenderEnum } from '../../../../core/enums/gender.enum';
import { TooltipModule } from 'primeng/tooltip';
import { TeacherFormComponent } from '../teacher-form/teacher-form';
import { TeacherQualification } from '../teacher-qualification/teacher-qualification';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { TeacherExperience } from '../teacher-experience/teacher-experience';
import { UserAttachmentDialog } from "../../../shared/components/user-attachment-dialog/user-attachment-dialog";
import { UserAttachment } from '../../../../core/models/user-attachment.model';
import { TeacherAttachmentComponent } from '../teacher-attachment/teacher-attachment';
import { ToastService } from '../../../shared/services/toast.service';
import { TableModule } from 'primeng/table';
import { Course } from '../../../../core/models/course.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoursesDialog } from '../../../shared/dialogs/courses-dialog/courses-dialog';

@Component({
  selector: 'app-teacher-profile',
  imports: [CardContainer, TabsModule, TooltipModule, TeacherFormComponent, TeacherQualification, CommonModule, TeacherExperience, UserAttachmentDialog, TeacherAttachmentComponent, TableModule, CoursesDialog, TranslateModule],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.scss'
})
export class TeacherProfile {

  //#region Properties
  showEditInfoDialog = false;
  showQualificationDialog = false;
  showExperienceDialog = false;
  showUserAttachmentDialog = false;
  showCoursesDialog = false;
  disablePage = false;

  teacher: Teacher = {} as Teacher;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private teacherService = inject(TeacherService);
  private loader = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);

  //#endregion

  //#region Methods

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.teacher.id = Number(params['id']);
      this.loadTeacher();
    });

  }

  loadTeacher() {
    this.loader.show();
    this.teacherService.get(this.teacher.id).pipe(takeUntil(this.destroy$)).subscribe((teacher: Teacher) => {
      this.teacher = teacher;

      if(teacher.id == 0) {
        this.toaster.showError(this.translate.instant('teachers.notFound'));
        this.disablePage = true;
      }

      this.cdr.detectChanges();
    }, _ => { }, () => {
      this.loader.hide();
      this.showEditInfoDialog = false;
      this.showQualificationDialog = false;
      this.showExperienceDialog = false;
      this.showUserAttachmentDialog = false;
      this.showCoursesDialog = false;
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
    return imageUrl ? this.teacherService.getViewAttachmentUrl(imageUrl) : 'assets/icons/avatar-teacher.svg';
  }

  onUploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.loader.show();
      this.teacherService.uploadImage(file, this.teacher.id).subscribe(res => {
        if(res) {
          this.loadTeacher();
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

  onEditTeacher() {
    this.teacher = { ...this.teacher };
    this.showEditInfoDialog = true;
  }

  //#endregion

  //#region Teacher Qualification and Experience

  onEditQualification() {
    this.teacher = { ...this.teacher };
    this.showQualificationDialog = true;
  }

  onEditExperience() {
    this.teacher = { ...this.teacher };
    this.showExperienceDialog = true;
  }

  //#endregion

  //#region User Attachment

  onAddUserAttachment() {
    this.showUserAttachmentDialog = true;
  }

  saveUserAttachment(userAttachment: UserAttachment) {
    this.loader.show();
    this.teacherService.uploadAttachment(userAttachment).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.loadTeacher();
    }, _ => { }, () => {
      this.loader.hide();
      this.showUserAttachmentDialog = false;
    });
  }

  //#endregion

  //#region Teacher Courses
  
  onEditCourses() {
    this.teacher = { ...this.teacher };
    this.showCoursesDialog = true;
  }

  saveCourses(courses: Course[]) {
    this.teacher.courses = courses;

    this.loader.show();
    this.teacherService.update(this.teacher).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res) {
        this.loadTeacher();
        this.toaster.showSuccess('تم تحديث الدورات بنجاح');
      }
    }, _ => { }, () => {
      this.loader.hide();
    });
  }
  //#endregion

}
