import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SessionCard } from '../session-card/session-card';
import { ClassSession } from '../../../../core/models/class-session.model';
import { SessionService } from '../../../../core/services/session.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'sessions-list',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    SessionCard,
    TooltipModule
  ],
  templateUrl: './sessions-list.html',
  styleUrl: './sessions-list.scss'
})
export class SessionsList implements OnInit {

  sessions: ClassSession[] = [];
  selectedSession: ClassSession | null = null;

  private loader = inject(LoaderService);
  private sessionService: SessionService = inject(SessionService);
  public permissionService: PermissionAccessService = inject(PermissionAccessService);
  private router = inject(Router);

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
      if (success) {
        this.getUserSessions();
      }
    }, err => {}, () => this.loader.hide());
  }

  onRecordAttendance(session: ClassSession) {
    this.router.navigate(['sessions', session.id, 'attendance']);
  }

  onAttendanceRecorded(success: boolean) {
    if (success) {
      // Optionally refresh sessions or show success message
      console.log('Attendance recorded successfully');
    }
  }
} 