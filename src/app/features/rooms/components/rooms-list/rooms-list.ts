import { Component, inject } from '@angular/core';
import { Room } from '../../../../core/models/room.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { Subject, takeUntil } from 'rxjs';
import { RoomService } from '../../../../core/services/room.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { CommonModule } from '@angular/common';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { RoomFormComponent } from '../room-form/room-form';
import { FilterOperators } from '../../../shared/props/query-filter-params.props';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeleteConfirmation } from '../../../shared/components/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-rooms-list',
  imports: [CommonModule, Grid, CardContainer, DialogModule, RoomFormComponent, TranslateModule, DeleteConfirmation],
  templateUrl: './rooms-list.html',
  styleUrl: './rooms-list.scss'
})
export class RoomsList {

  //#region Properties
  showDialog = false;
  showDeleteDialog = false;
  room: Room = {} as Room;
  roomToDelete: Room = {} as Room;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  rooms: PagedList<Room> = {} as PagedList<Room>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private roomService = inject(RoomService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', title: this.translate.instant('shared.fields.name'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'capacity', title: this.translate.instant('shared.fields.capacity'), columnType: ColumnTypeEnum.number, sortable: true, filterType: ColumnFilterTypeEnum.number, filterOperator: FilterOperators.equal },
  ];
  //#endregion

  //#region Methods

  loadRooms(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.roomService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(rooms => {
      this.rooms = rooms;
    }, _ => { }, () => this.loader.hide());
  }

  onEdit(event: Room) {
    this.room = event;
    this.showDialog = true;
  }

  onActivate(event: Room) {
    this.roomService.activate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadRooms(this.queryParams);
          this.toaster.showSuccess(this.translate.instant('rooms.activateSuccess'));
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDeactivate(event: Room) {
    this.roomService.deactivate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadRooms(this.queryParams);
          this.toaster.showSuccess(this.translate.instant('rooms.deactivateSuccess'));
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDelete(event: Room) {
    this.roomToDelete = event;
    this.showDeleteDialog = true;
  }

  onConfirmDelete() {
    this.loader.show();
    
    this.roomService.delete(this.roomToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadRooms(this.queryParams);
          this.toaster.showSuccess(this.translate.instant('rooms.deleteSuccess'));
        }
      }, _ => { }, () => this.loader.hide());
    
    this.showDeleteDialog = false;
    this.roomToDelete = {} as Room;
  }

  onCancelDelete() {
    this.showDeleteDialog = false;
    this.roomToDelete = {} as Room;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion


}
