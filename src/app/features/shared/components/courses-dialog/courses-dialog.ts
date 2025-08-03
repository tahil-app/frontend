import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Dropdown } from '../dropdown/dropdown';
import { SaveBtn } from '../../buttons/save-btn/save-btn';
import { CancelBtn } from '../../buttons/cancel-btn/cancel-btn';
import { DropdownProps } from '../../props/dropdown.props';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../../../../core/services/course.service';
import { LoaderService } from '../../services/loader.service';
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'courses-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    Dropdown,
    SaveBtn,
    CancelBtn,
  ],
  templateUrl: './courses-dialog.html',
  styleUrl: './courses-dialog.scss'
})
export class CoursesDialog {

  @Input() showDialog = false;
  @Input() selectedCourses: Course[] = [];

  @Output() onSave = new EventEmitter<Course[]>();
  @Output() onCancel = new EventEmitter<void>();

  coursesForm!: FormGroup;
  courses: Course[] = [];
  coursesOptions: DropdownProps[] = [];
  destroy$ = new Subject<void>();

  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);
  private loader = inject(LoaderService);

  ngOnInit() {
    this.initForm();
    this.loadCourses();
  }

  initForm() {
    this.coursesForm = this.fb.group({
      courses: [[]],
    });
  }

  getFormControl(controlName: string) {
    return this.coursesForm.get(controlName) as FormControl;
  }

  loadCourses() {
    this.loader.show();
    this.courseService.getAll().pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.courses = items;
      this.coursesOptions = items.map(course => ({ label: course.name, value: course.id }));
    }, _ => { }, () => {
      this.loader.hide();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog == true) {
      this.coursesForm.reset();
    }

    if (this.coursesForm && this.selectedCourses.length > 0) {
      this.getFormControl('courses')?.setValue(this.selectedCourses.map(course => course.id));
      this.getFormControl('courses')?.updateValueAndValidity();
    }
  }

  save() {
    if (this.coursesForm.valid) {
      this.onSave.emit(this.courses.filter(course => this.coursesForm.value.courses.includes(course.id)));
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
