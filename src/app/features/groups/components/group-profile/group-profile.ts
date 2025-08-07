import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Group } from '../../../../core/models/group.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BadgeHelper } from '../../../shared/helpers/badge.helper';
import { GroupService } from '../../../../core/services/group.service';
import { TooltipModule } from 'primeng/tooltip';
import { GroupFromComponent } from '../group-from/group-from';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { StudentsDialog } from '../../../shared/dialogs/students-dialog/students-dialog';
import { Student } from '../../../../core/models/student.model';
import { EditIconButton } from '../../../shared/buttons/edit-icon-button/edit-icon-button';

@Component({
  selector: 'app-group-profile',
  imports: [CommonModule, TabsModule, TableModule, TranslateModule, TooltipModule, GroupFromComponent, StudentsDialog, EditIconButton],
  templateUrl: './group-profile.html',
  styleUrl: './group-profile.scss'
})
export class GroupProfile implements OnInit {

  //#region Properties
  showDialog = false;
  showStudentsDialog = false;
  group: Group = {} as Group;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  private badgeHelper = BadgeHelper.createCapacityBadge(this.translate);
  public permissionAccess = inject(PermissionAccessService);
  //#endregion

  //#region Methods

  ngOnInit() {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));
    if (groupId) {
      this.loadGroup(groupId);
    } else {
      this.toaster.showError(this.translate.instant('groups.notFound'));
    }
  }

  loadGroup(groupId: number) {
    this.loader.show();
    this.groupService.get(groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(group => {
        this.group = group;
        this.group.students = this.group.students?.sort((a, b) => a.name.localeCompare(b.name)) || [];
      }, error => {}, () => {
        this.loader.hide();
        this.showDialog = false;
      });
  }

  getCapacityPercentage(): number {
    if (!this.group.capacity || this.group.capacity === 0) return 0;
    return Math.round((this.group.numberOfStudents / this.group.capacity) * 100);
  }

  getCapacityStatus(): string {
    return this.badgeHelper.getValue(this.group);
  }

  getCapacityStatusColor(): string {
    return this.badgeHelper.getColor(this.group);
  }

  onTeacherClick() {
    if (this.group && this.group.teacher?.id) {
      this.router.navigate(['/teachers', this.group.teacher.id]);
    }
  }

  onStudentClick(studentId: number) {
    if (studentId) {
      this.router.navigate(['/students', studentId]);
    }
  }

  onEditGroup() {
    this.showDialog = true;
  }

  onAddStudent() {
    this.showStudentsDialog = true;
  }

  onSaveStudents(students: Student[]) {
    this.group.students = students;

    this.loader.show();
    this.groupService.updateStudents(this.group.id, students.map(student => student.id)).pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.toaster.showSuccess(this.translate.instant('groups.studentsUpdated'));
        this.loadGroup(this.group.id);
      }
    }, error => {}, () => {
      this.loader.hide();
      this.showStudentsDialog = false;
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion
} 