import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { SaveBtn } from "../../../shared/buttons/save-btn/save-btn";
import { CancelBtn } from "../../../shared/buttons/cancel-btn/cancel-btn";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Dropdown } from "../../../shared/components/dropdown/dropdown";
import { LabelDatePicker } from "../../../shared/components/label-date-picker/label-date-picker";
import { LessonScheduleLookup } from "../../../../core/models/lesson-schedule-lookup.model";
import { DropdownProps, getDropdownOptions } from "../../../shared/props/dropdown.props";
import { Subject, takeUntil } from "rxjs";
import { WeekDaysHelper } from "../../../../core/helpers/week-days.helper";
import { LessonScheduleService } from "../../../../core/services/lesson-schedule.service";
import { LoaderService } from "../../../shared/services/loader.service";
import { ToastService } from "../../../shared/services/toast.service";
import { LessonSchedule } from "../../../../core/models/lesson-schedule.model";

@Component({
  selector: 'app-schedule-form',
  imports: [CommonModule, DialogModule, SaveBtn, CancelBtn, ReactiveFormsModule, LabelDatePicker, Dropdown],
  templateUrl: './schedule-form.html',
  styleUrl: './schedule-form.scss'
})
export class ScheduleForm {

  //#region Properties
  @Input() showDialog = false;
  @Input() schedule: LessonSchedule = {} as LessonSchedule;
  scheduleForm!: FormGroup;
  lookups: LessonScheduleLookup = {} as LessonScheduleLookup;

  roomsDropdownOptions: DropdownProps[] = [];
  coursesDropdownOptions: DropdownProps[] = [];
  teachersDropdownOptions: DropdownProps[] = [];
  groupsDropdownOptions: DropdownProps[] = [];

  destroy$ = new Subject<void>();
  days = WeekDaysHelper.getDays();

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private fb = inject(FormBuilder);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private scheduleService = inject(LessonScheduleService);
  //#endregion

  //#region Methods

  ngOnInit() {
    this.initForm();
    this.loadLookups();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['showDialog'] && (!this.schedule.id || this.schedule.id === 0)) {
      this.scheduleForm?.reset();
    }

    if (this.scheduleForm && changes['schedule'] && this.schedule.id > 0) {
      this.scheduleForm.patchValue(this.schedule);
      this.scheduleForm.get('startDate')?.setValue(this.schedule.startDate ? new Date(this.schedule.startDate) : null);
      this.scheduleForm.get('endDate')?.setValue(this.schedule.endDate ? new Date(this.schedule.endDate) : null);
      this.scheduleForm.markAllAsTouched();
    }
  }

  loadLookups() {
    this.scheduleService.getLookups().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lookups = res;
      this.groupsDropdownOptions = getDropdownOptions(res.groups);
      this.roomsDropdownOptions = getDropdownOptions(res.rooms);
      this.coursesDropdownOptions = getDropdownOptions(res.courseTeachers.map(r => r.course));
    });
  }

  initForm() {
    this.scheduleForm = this.fb.group({
      id: [0],
      groupId: [0, [Validators.required]],
      roomId: [0, [Validators.required]],
      courseId: [0, [Validators.required]],
      teacherId: [0, [Validators.required]],
      startDate: [''],
      endDate: ['', [Validators.required]],
    });

    this.getControl('courseId').valueChanges.pipe(takeUntil(this.destroy$)).subscribe((courseId: number) => {
      const courseTeacher = this.lookups.courseTeachers.find(ct => ct.course.id === courseId);
      this.teachersDropdownOptions = courseTeacher?.teachers.map(teacher => ({
        label: teacher.name,
        value: teacher.id
      })) || [];
    });
  }

  courseHasTeachers(courseId: number) {
    if(courseId === null) return true;

    return (this.lookups.courseTeachers.find(ct => ct.course.id === courseId)?.teachers.length || 0) > 0;
  }
  
  hasId() {
    return this.scheduleForm.get('id')?.value;
  }

  getControl(name: string) {
    return this.scheduleForm.get(name) as FormControl;
  }

  save() {
    if(this.scheduleForm.valid) {

      const scheduleData = this.scheduleForm.value as LessonSchedule;
      scheduleData.id = 0;

      this.loader.show();
      this.scheduleService.add(scheduleData).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if(res) {
          this.onSave.emit();
          this.toaster.showSuccess('تم حفظ الجدول بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if(this.scheduleForm.valid) {
      const scheduleData = this.scheduleForm.value as LessonSchedule;
      scheduleData.id = this.schedule.id;
      
      this.loader.show();
      this.scheduleService.update(scheduleData).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if(res) {
          this.onSave.emit();
          this.toaster.showSuccess('تم تحديث الجدول بنجاح');
        }
      }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.scheduleForm.reset();
    this.onCancel.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion
}
