import { Component, inject, OnInit } from '@angular/core';
import { Course } from '../../../../core/models/course.model';
import { CourseService } from '../../../../core/services/course.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonModule } from '@angular/common';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { PagedList } from '../../../shared/models/paged-list.model';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { DialogModule } from 'primeng/dialog';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { CourseForm } from '../course-form/course-form';

@Component({
  selector: 'app-courses-list',
  imports: [CommonModule, Grid, CardContainer, DialogModule, CourseForm],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.scss'
})
export class CoursesListComponent {

  //#region Properties
  showDialog = false;
  course: Course = {} as Course;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  courses: PagedList<Course> = {} as PagedList<Course>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private courseService = inject(CourseService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', title: 'الاسم', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
  ];
  //#endregion

  //#region Methods

  loadCourses(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.courseService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(courses => {
      this.courses = courses;
    }, _ => { }, () => this.loader.hide());
  }

  onEdit(event: Course) {
    this.course = event;
    this.showDialog = true;
  }

  onActivate(event: Course) {
    this.courseService.activate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadCourses(this.queryParams);
          this.toaster.showSuccess('تم تفعيل الدورة بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDeactivate(event: Course) {
    this.courseService.deactivate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadCourses(this.queryParams);
          this.toaster.showSuccess('تم تعطيل الدورة بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  } 

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
