import { Component, inject } from '@angular/core';
import { Teacher } from '../../../../core/models/teacher.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { CommonModule } from '@angular/common';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { TeacherFormComponent } from '../teacher-form/teacher-form';

@Component({
  selector: 'app-teachers-list',
  imports: [CommonModule, Grid, CardContainer, DialogModule, TeacherFormComponent],
  templateUrl: './teachers-list.html',
  styleUrl: './teachers-list.scss'
})
export class TeachersList {

  //#region Properties
  showDialog = false;
  teacher: Teacher = {} as Teacher;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  teachers: PagedList<Teacher> = {} as PagedList<Teacher>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private teacherService = inject(TeacherService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', title: 'الاسم', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'phoneNumber', title: 'رقم الهاتف', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'email', title: 'البريد الإلكتروني', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'role', title: 'الصلاحية', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'joinedDate', title: 'تاريخ الانضمام', columnType: ColumnTypeEnum.date, sortable: true, filterType: ColumnFilterTypeEnum.text },
  ];
  //#endregion

  //#region Methods

  loadTeachers(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.teacherService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(teachers => {
      this.teachers = teachers;
    }, _ => { }, () => this.loader.hide());
  }

  onEdit(event: Teacher) {
    this.teacher = event;
    this.showDialog = true;
  }

  onActivate(event: Teacher) {
    this.teacherService.activate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadTeachers(this.queryParams);
          this.toaster.showSuccess('تم تفعيل المعلم بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDeactivate(event: Teacher) {
    this.teacherService.deactivate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadTeachers(this.queryParams);
          this.toaster.showSuccess('تم تعطيل المعلم بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion


}
