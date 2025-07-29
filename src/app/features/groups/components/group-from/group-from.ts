import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { Group } from '../../../../core/models/group.model';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../../../core/services/group.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-group-from',
  imports: [CommonModule, DialogModule, SaveBtn, CancelBtn, InputTextModule, ReactiveFormsModule, InputLabel],
  templateUrl: './group-from.html',
  styleUrl: './group-from.scss'
})
export class GroupFromComponent {

  //#region Properties
  @Input() showDialog = false;
  @Input() group: Group = {} as Group;
  groupForm!: FormGroup;
  destroy$ = new Subject<void>();

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private groupService = inject(GroupService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private fb = inject(FormBuilder);
  //#endregion

  //#region Methods
  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['showDialog'] && !this.group.id) {
      this.groupForm?.reset();
    }

    if (changes['group'] && this.group.id > 0) {
      this.groupForm?.patchValue(this.group);
    }

  }

  initForm() {
    this.groupForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      capacity: [0]
    });
  }

  hasId() {
    return this.groupForm.get('id')?.value;
  }

  getFormControl(name: string) {
    return this.groupForm.get(name) as FormControl;
  }

  save() {
    if (this.groupForm.valid) {
      this.loader.show();

      const GroupData = this.groupForm.value as Group;
      GroupData.id = 0;
      GroupData.capacity = Number(GroupData.capacity) ?? 0;

      this.groupService.add(GroupData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.groupForm.reset();
            this.toaster.showSuccess('تم حفظ المجموعة بنجاح');
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if (this.groupForm.valid) {
      this.loader.show();

      const GroupData = this.groupForm.value as Group;
      GroupData.capacity = Number(GroupData.capacity) ?? 0;

      this.groupService.update(GroupData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.groupForm.reset();
            this.onSave.emit();
            this.toaster.showSuccess('تم تعديل المجموعة بنجاح');
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.groupForm.reset();
    this.onCancel.emit();
  }

  onAdd() {
    this.groupForm.reset();
    this.groupForm.get('id')?.setValue(0);
    this.showDialog = true;
  }

  onEdit(event: Group) {
    this.groupForm.patchValue(event);
    this.showDialog = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
