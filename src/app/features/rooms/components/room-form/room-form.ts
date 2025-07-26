import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { Room } from '../../../../core/models/room.model';
import { Subject, takeUntil } from 'rxjs';
import { RoomService } from '../../../../core/services/room.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-room-form',
  imports: [CommonModule, DialogModule, SaveBtn, CancelBtn, InputTextModule, ReactiveFormsModule, InputLabel],
  templateUrl: './room-form.html',
  styleUrl: './room-form.scss'
})
export class RoomFormComponent {

  //#region Properties
  @Input() showDialog = false;
  @Input() room: Room = {} as Room;
  roomForm!: FormGroup;
  destroy$ = new Subject<void>();

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private roomService = inject(RoomService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private fb = inject(FormBuilder);
  //#endregion

  //#region Methods
  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['showDialog'] && !this.room.id) {
      this.roomForm?.reset();
    }

    if (changes['room'] && this.room.id > 0) {
      this.roomForm?.patchValue(this.room);
    }

  }

  initForm() {
    this.roomForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  hasId() {
    return this.roomForm.get('id')?.value;
  }

  getFormControl(name: string) {
    return this.roomForm.get(name) as FormControl;
  }

  save() {
    if (this.roomForm.valid) {
      this.loader.show();
      const roomData = this.roomForm.value as Room;
      roomData.id = 0;
      this.roomService.add(roomData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.roomForm.reset();
            this.toaster.showSuccess('تم حفظ الحلقة بنجاح');
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if (this.roomForm.valid) {
      this.loader.show();
      const roomData = this.roomForm.value as Room;
      this.roomService.update(roomData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.roomForm.reset();
            this.onSave.emit();
            this.toaster.showSuccess('تم تعديل الحلقة بنجاح');
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.roomForm.reset();
    this.onCancel.emit();
  }

  onAdd() {
    this.roomForm.reset();
    this.roomForm.get('id')?.setValue(0);
    this.showDialog = true;
  }

  onEdit(event: Room) {
    this.roomForm.patchValue(event);
    this.showDialog = true;
  }

  onActivate(event: Room) {
    this.roomService.activate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess('تم تفعيل الحلقة بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDeactivate(event: Room) {
    this.roomService.deactivate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess('تم تعطيل الحلقة بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
