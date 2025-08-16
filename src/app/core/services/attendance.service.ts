import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';
import { StudentAttendance, StudentAttendanceDisplay } from '../models/student-attendance.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class AttendanceService extends ApiService<StudentAttendance> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.STUDENT_ATTENDANCE.Controller);
  }

  getAttendances(sessionId: number): Observable<StudentAttendanceDisplay> {
    return this.httpClient.get<StudentAttendanceDisplay>(
      this.appURLGenerator.getEndPoint(`${ApiEndpoints.STUDENT_ATTENDANCE.Actions.Session(sessionId)}`)
    );
  }

  updateAttendances(sessionId: number, attendanceRecords: StudentAttendance[]): Observable<boolean> {
    return this.httpClient.put<boolean>(
      this.appURLGenerator.getEndPoint(ApiEndpoints.STUDENT_ATTENDANCE.Actions.Update(sessionId)),
      attendanceRecords
    );
  }

} 