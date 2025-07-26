import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { TabsModule } from 'primeng/tabs';
import { Teacher } from '../../../../core/models/teacher.model';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { DataHelper } from '../../../../core/helpers/data.helper';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { GenderEnum } from '../../../../core/enums/gender.enum';
import { TooltipModule } from 'primeng/tooltip';
import { TeacherFormComponent } from '../teacher-form/teacher-form';
import { TeacherQualification } from '../teacher-qualification/teacher-qualification';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { TeacherExperience } from '../teacher-experience/teacher-experience';

@Component({
  selector: 'app-teacher-profile',
  imports: [CardContainer, TabsModule, TooltipModule, TeacherFormComponent, TeacherQualification, CommonModule, TeacherExperience],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.scss'
})
export class TeacherProfile {

  //#region Properties
  showEditInfoDialog = false;
  showQualificationDialog = false;
  showExperienceDialog = false;
  teacher: Teacher = {} as Teacher;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private teacherService = inject(TeacherService);
  private loader = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  //#endregion

  //#region Methods

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.teacher.id = Number(params['id']);
      this.loadTeacher();
    });

  }

  loadTeacher() {
    this.loader.show();
    this.teacherService.get(this.teacher.id).pipe(takeUntil(this.destroy$)).subscribe((teacher: Teacher) => {
      this.teacher = teacher;
      this.cdr.detectChanges();
    }, _ => { }, () => {
      this.loader.hide();
      this.showEditInfoDialog = false;
      this.showQualificationDialog = false;
      this.showExperienceDialog = false;
    });
  }

  getSafeHtml(html: string) {
    return html ? this.sanitizer.bypassSecurityTrustHtml(html) : '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //#endregion

  //#region Teacher Info

  getAge(birthDate: string) {
    return DataHelper.getAge(birthDate);
  }

  getGender(gender: GenderEnum) {
    return GenderHelper.get(gender);
  }

  onEditTeacher() {
    this.teacher = { ...this.teacher };
    this.showEditInfoDialog = true;
  }

  //#endregion

  //#region Teacher Qualification and Experience

  onEditQualification() {
    this.teacher = { ...this.teacher };
    this.showQualificationDialog = true;
  }

  onEditExperience() {
    this.teacher = { ...this.teacher };
    this.showExperienceDialog = true;
  }

  //#endregion

}
