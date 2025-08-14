import { Component, inject, OnInit } from '@angular/core';
import { CardContainer } from "../../../shared/components/card-container/card-container";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { Attendance } from '../../../../core/models/attendance.model';
import { Student } from '../../../../core/models/student.model';
import { AttendanceStatus } from '../../../../core/enums/attendance-status.enum';
import { LoaderService } from '../../../shared/services/loader.service';
import { StudentService } from '../../../../core/services/student.service';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { GenderEnum } from '../../../../core/enums/gender.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-attendance',
  imports: [
    CardContainer, 
    TranslateModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    RadioButtonModule,
    SaveBtn,
    CancelBtn
  ],
  templateUrl: './session-attendance.html',
  styleUrl: './session-attendance.scss'
})
export class SessionAttendance implements OnInit {

  //#region Properties
  session: ClassSession = {} as ClassSession;
  attendanceRecords: Attendance[] = [];
  students: Student[] = [];
  AttendanceStatus = AttendanceStatus;
  //#endregion

  //#region Services
  private attendanceService: AttendanceService = inject(AttendanceService);
  private studentService: StudentService = inject(StudentService);
  private loaderService: LoaderService = inject(LoaderService);
  private translateService: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  //#endregion

  //#region Methods 

  ngOnInit() {
    this.loadSessionData();
  }

  private loadSessionData() {
    this.loaderService.show();

    // Load students for the group (assuming we have groupId from session)
    // For now, we'll create mock data since we don't have the exact API
    this.loadStudentsForSession();
  }

  private loadStudentsForSession() {
    // This would typically load students based on the session's group
    // For now, creating mock data with more realistic sample data
    this.students = [
      { id: 1, name: 'Ahmed Ali Hassan', email: 'ahmed.ali@example.com', phoneNumber: '0501234567', password: '', role: 2, gender: GenderEnum.Male, joinedDate: '2024-01-15', birthDate: '2005-03-15', isActive: true, imagePath: '', qualification: '', attachments: [], groups: [] },
      { id: 2, name: 'Fatima Zahra Mohammed', email: 'fatima.zahra@example.com', phoneNumber: '0509876543', password: '', role: 2, gender: GenderEnum.Female, joinedDate: '2024-01-20', birthDate: '2006-07-22', isActive: true, imagePath: '', qualification: '', attachments: [], groups: [] },
      { id: 3, name: 'Mohammed Omar Khalil', email: 'mohammed.omar@example.com', phoneNumber: '0505555555', password: '', role: 2, gender: GenderEnum.Male, joinedDate: '2024-02-01', birthDate: '2005-11-08', isActive: true, imagePath: '', qualification: '', attachments: [], groups: [] },
      { id: 4, name: 'Aisha Saleh Al-Rashid', email: 'aisha.saleh@example.com', phoneNumber: '0501111111', password: '', role: 2, gender: GenderEnum.Female, joinedDate: '2024-01-10', birthDate: '2006-01-30', isActive: true, imagePath: '', qualification: '', attachments: [], groups: [] },
      { id: 5, name: 'Omar Abdullah Al-Zahra', email: 'omar.abdullah@example.com', phoneNumber: '0502222222', password: '', role: 2, gender: GenderEnum.Male, joinedDate: '2024-02-05', birthDate: '2005-09-12', isActive: true, imagePath: '', qualification: '', attachments: [], groups: [] },
      { id: 6, name: 'Layla Ahmed Al-Mansouri', email: 'layla.ahmed@example.com', phoneNumber: '0503333333', password: '', role: 2, gender: GenderEnum.Female, joinedDate: '2024-01-25', birthDate: '2006-04-18', isActive: true, imagePath: '', qualification: '', attachments: [], groups: [] },
      { id: 7, name: 'Youssef Ibrahim Al-Hamdan', email: 'youssef.ibrahim@example.com', phoneNumber: '0504444444', password: '', role: 2, gender: GenderEnum.Male, joinedDate: '2024-02-10', birthDate: '2005-12-03', isActive: true, imagePath: '', qualification: '', attachments: [], groups: [] },
      { id: 8, name: 'Noor Hassan Al-Qahtani', email: 'noor.hassan@example.com', phoneNumber: '0506666666', password: '', role: 2, gender: GenderEnum.Female, joinedDate: '2024-01-30', birthDate: '2006-06-25', isActive: true, imagePath: '', qualification: '', attachments: [], groups: [] }
    ];

    // Initialize attendance records with some realistic sample data
    this.attendanceRecords = this.students.map((student, index) => ({
      id: 0,
      sessionId: this.session.id,
      studentId: student.id,
      status: index < 5 ? AttendanceStatus.Present : 
              index === 5 ? AttendanceStatus.Late :
              AttendanceStatus.Absent,
      notes: index === 1 ? 'Late by 10 minutes' : 
             index === 3 ? 'Excused - medical appointment' : 
             index === 5 ? 'Arrived 15 minutes late' :
             index === 6 ? 'Absent - family emergency' : 
             index === 7 ? 'No show' : '',
      recordedBy: 0,
      recordedOn: new Date().toISOString(),
      studentName: student.name,
      studentEmail: student.email,
      sessionDate: this.session.date || new Date().toISOString(),
      courseName: this.session.courseName || 'Sample Course',
      groupName: this.session.groupName || 'Sample Group',
    } as Attendance));

    this.loaderService.hide();
  }

  onSave() {
    this.loaderService.show();
    this.attendanceService.recordAttendance(this.attendanceRecords).subscribe({
      next: (success) => {
        if (success) {
        }
      },
      error: (error) => {
        console.error('Error recording attendance:', error);
      },
      complete: () => {
        this.loaderService.hide();
      }
    });
  }

  onCancel() {
    this.router.navigate(["sessions"]);
  }

  markAllPresent() {
    this.attendanceRecords.forEach(record => record.status = AttendanceStatus.Present);
  }

  markAllAbsent() {
    this.attendanceRecords.forEach(record => record.status = AttendanceStatus.Absent);
  }

  markAllLate() {
    this.attendanceRecords.forEach(record => record.status = AttendanceStatus.Late);
  }

  // Computed properties for template
  get totalStudents(): number {
    return this.attendanceRecords.length;
  }

  get presentStudents(): number {
    return this.attendanceRecords.filter(r => r.status === AttendanceStatus.Present).length;
  }

  get lateStudents(): number {
    return this.attendanceRecords.filter(r => r.status === AttendanceStatus.Late).length;
  }

  get absentStudents(): number {
    return this.attendanceRecords.filter(r => r.status === AttendanceStatus.Absent).length;
  }

  //#endregion
}
