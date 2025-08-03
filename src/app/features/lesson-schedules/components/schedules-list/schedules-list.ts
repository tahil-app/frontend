import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { LessonSchedule } from '../../../../core/models/lesson-schedule.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { Subject, takeUntil } from 'rxjs';
import { LessonScheduleService } from '../../../../core/services/lesson-schedule.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { AppRoutes } from '../../../../core/consts/app-routes.const';
import { ScheduleForm } from '../schedule-form/schedule-form';

@Component({
  selector: 'app-schedules-list',
  imports: [CommonModule, Grid, CardContainer, DialogModule, ScheduleForm],
  templateUrl: './schedules-list.html',
  styleUrl: './schedules-list.scss'
})
export class SchedulesList {

  //#region Properties
  showDialog = false;
  schedule: LessonSchedule = {} as LessonSchedule;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  schedules: PagedList<LessonSchedule> = {} as PagedList<LessonSchedule>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private scheduleService = inject(LessonScheduleService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private router = inject(Router);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'roomName', apiField: 'Room.Name', title: 'الحلقة', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'courseName', apiField: 'Course.Name', title: 'الدورة', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'groupName', apiField: 'Group.Name', title: 'المجموعة', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'teacherName', apiField: 'Teacher.User.Name', title: 'المعلم', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'day', apiField: 'Day', title: 'اليوم', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'startTime', apiField: 'StartTime', title: 'الوقت البدء', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
  ];
  //#endregion

  //#region Methods
  loadSchedules(params: QueryParamsModel) {
    this.loader.show();
    this.scheduleService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.schedules = res;
    }, _ => { }, () => {
      this.showDialog = false;
      this.loader.hide();
    });
  }

  onAdd() {
    this.schedule = {} as LessonSchedule;
    this.showDialog = true;
  }

  onEdit(event: LessonSchedule) {
    this.schedule = event;
    this.showDialog = true;
  }

  onView(event: LessonSchedule) {
    // this.schedule = event;
    // this.showDialog = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion
}
