import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../../../../core/services/group.service';
import { DropdownProps } from '../../props/dropdown.props';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Dropdown } from '../dropdown/dropdown';
import { SaveBtn } from '../../buttons/save-btn/save-btn';
import { CancelBtn } from '../../buttons/cancel-btn/cancel-btn';
import { LoaderService } from '../../services/loader.service';
import { Group } from '../../../../core/models/group.model';

@Component({
  selector: 'groups-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    Dropdown,
    SaveBtn,
    CancelBtn,
  ],
  templateUrl: './groups-dialog.html',
  styleUrl: './groups-dialog.scss'
})
export class GroupsDialog {

  @Input() showDialog = false;
  @Input() selectedGroups: Group[] = [];

  @Output() onSave = new EventEmitter<Group[]>();
  @Output() onCancel = new EventEmitter<void>();

  groupsForm!: FormGroup;
  groups: Group[] = [];
  groupsOptions: DropdownProps[] = [];
  destroy$ = new Subject<void>();

  private groupService = inject(GroupService);
  private fb = inject(FormBuilder);
  private loader = inject(LoaderService);

  ngOnInit() {
    this.initForm();
    this.loadGroups();
  }

  initForm() {
    this.groupsForm = this.fb.group({
      groups: [[]],
    });
  }

  getFormControl(controlName: string) {
    return this.groupsForm.get(controlName) as FormControl;
  }

  loadGroups() {
    this.loader.show();
    this.groupService.getAll().pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.groups = items;
      this.groupsOptions = items.map(group => ({ label: group.name, value: group.id }));
    }, _ => { }, () => {
      this.loader.hide();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog == true) {
      this.groupsForm.reset();
    }

    if (this.groupsForm && this.selectedGroups.length > 0) {
      this.getFormControl('groups')?.setValue(this.selectedGroups.map(group => group.id));
      this.getFormControl('groups')?.updateValueAndValidity();
    }
  }

  save() {
    if (this.groupsForm.valid) {
      this.onSave.emit(this.groups.filter(group => this.groupsForm.value.groups.includes(group.id)));
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
