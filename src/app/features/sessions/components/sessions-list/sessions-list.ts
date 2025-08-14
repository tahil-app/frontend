import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SessionCard } from '../session-card/session-card';
import { SessionForm } from '../session-form/session-form';
import { ClassSession } from '../../../../core/models/class-session.model';
import { SessionService } from '../../../../core/services/session.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'sessions-list',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    SessionCard,
    SessionForm,
    TooltipModule
  ],
  templateUrl: './sessions-list.html',
  styleUrl: './sessions-list.scss'
})
export class SessionsList implements OnInit {

  sessions: ClassSession[] = [];
  selectedSession: ClassSession | null = null;
  showSessionForm = false;

  private loader = inject(LoaderService);
  private sessionService: SessionService = inject(SessionService);
  private router = inject(Router);
  public permissionService: PermissionAccessService = inject(PermissionAccessService);
  private toaster = inject(ToastService);
  private translateService = inject(TranslateService);

  ngOnInit() {
    this.getUserSessions();
  }

  getUserSessions() {
    this.loader.show();
    this.sessionService.getUserSessions().subscribe((sessions) => {
        this.sessions = sessions;
    }, err => {}, () => this.loader.hide());
  }

  refreshSessions() {
    this.loader.show();
    this.sessionService.refreshSessions().subscribe((success) => {
      this.getUserSessions();
      this.toaster.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
    }, err => {}, () => this.loader.hide());
  }

  onRecordAttendance(session: ClassSession) {
    this.router.navigate(['sessions', session.id, 'attendance']);
  }

  updateSession(session: ClassSession) {
    this.selectedSession = session;
    this.showSessionForm = true;
  }

  onSessionUpdated() {
    this.showSessionForm = false;
    this.selectedSession = null;
    this.getUserSessions();
  }

  onSessionFormCancelled() {
    this.showSessionForm = false;
    this.selectedSession = null;
  }

  cancelSession(session: ClassSession) {
    this.loader.show();

    this.sessionService.updateStatus(session.id!, ClassSessionStatus.Cancelled).subscribe((success) => {
      if (success) {
        this.getUserSessions();
        this.toaster.showSuccess(this.translateService.instant('sessions.cancelledSuccessfully'));
      }
    }, err => {}, () => this.loader.hide());
  }

  markCompletedSession(session: ClassSession) {
    this.loader.show();
    this.sessionService.updateStatus(session.id!, ClassSessionStatus.Completed).subscribe((success) => {
      this.getUserSessions();
      this.toaster.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
    }, err => {}, () => this.loader.hide());
  }

  rescheduleSession(session: ClassSession) {  
    this.loader.show();

    this.sessionService.updateStatus(session.id!, ClassSessionStatus.Scheduled).subscribe((success) => {
      if (success) {
        this.getUserSessions();
        this.toaster.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
      }
    }, err => {}, () => this.loader.hide());
  }
} 