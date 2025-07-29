import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { GroupFromComponent } from '../group-from/group-from';
import { Group } from '../../../../core/models/group.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../../../core/services/group.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { FilterOperators } from '../../../shared/props/query-filter-params.props';
import { DeleteConfirmation } from '../../../shared/components/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-groups-list',
  imports: [CommonModule, Grid, CardContainer, DialogModule, GroupFromComponent, DeleteConfirmation],
  templateUrl: './groups-list.html',
  styleUrl: './groups-list.scss'
})
export class GroupsList {

  //#region Properties
  showDialog = false;
  showDelete = false;
  deleteMessage = '';
  group: Group = {} as Group;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  groups: PagedList<Group> = {} as PagedList<Group>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private groupService = inject(GroupService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', title: 'الاسم', columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'capacity', title: 'الكثافة الطلابية', columnType: ColumnTypeEnum.number, sortable: true, filterType: ColumnFilterTypeEnum.number, filterOperator: FilterOperators.equal },
    { field: 'numberOfStudents', title: 'عدد الطلاب', columnType: ColumnTypeEnum.number, sortable: true, filterType: ColumnFilterTypeEnum.number, filterOperator: FilterOperators.equal },
  ];
  //#endregion

  //#region Methods

  loadGroups(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.groupService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(groups => {
      this.groups = groups;
    }, _ => { }, () => this.loader.hide());
  }

  onEdit(event: Group) {
    this.group = event;
    this.showDialog = true;
  }

  deletedGroup: Group = {} as Group;
  onDelete(event: Group) {
    this.deleteMessage = `هل أنت متأكد من حذف المجموعة <b>${event.name}</b>؟`;
    this.deletedGroup = event;
    this.showDelete = true;
  }

  onDeleteConfirm() {
    this.groupService.delete(this.deletedGroup.id).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.showDelete = false;
        this.toaster.showSuccess('تم حذف المجموعة بنجاح');
        this.loadGroups(this.queryParams);
      }
    }, _ => { }, () => this.loader.hide());
  }
  onDeleteCancel() {
    this.showDelete = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion


}
