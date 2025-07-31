import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LessonSchedule } from '../../../../core/models/lesson-schedule.model';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { FieldsetModule } from 'primeng/fieldset';
import { DeleteIconButton } from "../../../shared/buttons/delete-icon-button/delete-icon-button";
import { WeekDaysHelper } from '../../../../core/helpers/week-days.helper';
import { LabelTimePicker } from "../../../shared/components/label-time-picker/label-time-picker";
import { Router } from '@angular/router';
import { AppRoutes } from '../../../../core/consts/app-routes.const';

@Component({
  selector: 'app-schedule-form',
  imports: [CommonModule, CardContainer, ReactiveFormsModule, Dropdown, SaveBtn, CancelBtn, FieldsetModule, DeleteIconButton, LabelTimePicker],
  templateUrl: './schedule-form.html',
  styleUrl: './schedule-form.scss'
})
export class ScheduleForm {

  //#region Properties
  scheduleForm!: FormGroup;
  schedule: LessonSchedule = {} as LessonSchedule;
  destroy$ = new Subject<void>();
  days = WeekDaysHelper.getDays();
  //#endregion

  //#region Services
  private fb = inject(FormBuilder);
  private router = inject(Router);
  //#endregion

  //#region Methods

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.scheduleForm = this.fb.group({
      roomId: [this.schedule.roomId, [Validators.required]],
      courseId: [this.schedule.courseId, [Validators.required]],
      teacherId: [this.schedule.teacherId, [Validators.required]],
      groupId: [this.schedule.groupId, [Validators.required]],
    });
  }

  getControl(name: string) {
    return this.scheduleForm.get(name) as FormControl;
  }

  onCancel() {
    this.router.navigate([`/${AppRoutes.SCHEDULES}`]);
  }

  onSave() {
    console.log(this.scheduleForm.value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion
}
