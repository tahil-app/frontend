import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../../../core/models/course.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../../../../core/services/course.service';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { CourseForm } from '../course-form/course-form';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { EditIconButton } from '../../../shared/buttons/edit-icon-button/edit-icon-button';
import { TeachersDialog } from "../../../shared/dialogs/teachers-dialog/teachers-dialog";
import { Teacher } from '../../../../core/models/teacher.model';

@Component({
  selector: 'app-course-profile',
  imports: [CommonModule, TranslateModule, TooltipModule, TableModule, CourseForm, EditIconButton, TeachersDialog],
  templateUrl: './course-profile.html',
  styleUrl: './course-profile.scss'
})
export class CourseProfile implements OnInit {

  //#region Properties
  showDialog = false;
  showTeachersDialog = false;
  course: Course = {} as Course;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  public permissionAccess = inject(PermissionAccessService);
  //#endregion

  //#region Methods

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.loadCourse(courseId);
    } else {
      this.toaster.showError(this.translate.instant('courses.notFound'));
    }
  }

  loadCourse(courseId: number) {
    this.loader.show();
    this.courseService.get(courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(course => {
        this.course = course;
        this.course.teachers = this.course.teachers?.sort((a, b) => a.name.localeCompare(b.name)) || [];
      }, error => {}, () => {
        this.loader.hide();
        this.showDialog = false;
      });
  }

  onTeacherClick(teacherId: number) {
    if (teacherId) {
      this.router.navigate(['/teachers', teacherId]);
    }
  }

  onGroupClick(groupId: number) {
    if (groupId) {
      this.router.navigate(['/groups', groupId]);
    }
  }

  onEditCourse() {
    this.showDialog = true;
  }

  onAddTeacher() {
    this.showTeachersDialog = true;
  }

  onSaveTeachers(teachers: Teacher[]) {
    this.course.teachers = teachers;

    this.loader.show();

    this.courseService.updateTeachers(this.course.id, teachers.map(teacher => teacher.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.toaster.showSuccess(this.translate.instant('courses.teachersUpdated'));
          this.loadCourse(this.course.id);
        }
      }, error => { }, () => {
        this.loader.hide();
        this.showTeachersDialog = false;
      });


  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion
} 