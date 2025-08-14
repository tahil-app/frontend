import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class AttendanceService extends ApiService<Attendance> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.ATTENDANCE.Controller);
  }

  getSessionAttendance(sessionId: number): Observable<Attendance[]> {
    return this.httpClient.get<Attendance[]>(
      this.appURLGenerator.getEndPoint(`${ApiEndpoints.ATTENDANCE.Actions.GetSessionAttendance}/${sessionId}`)
    );
  }

  recordAttendance(attendanceRecords: Attendance[]): Observable<boolean> {
    return this.httpClient.post<boolean>(
      this.appURLGenerator.getEndPoint(ApiEndpoints.ATTENDANCE.Actions.RecordAttendance),
      attendanceRecords
    );
  }

  updateAttendance(attendance: Attendance): Observable<boolean> {
    return this.httpClient.put<boolean>(
      this.appURLGenerator.getEndPoint(ApiEndpoints.ATTENDANCE.Actions.UpdateAttendance),
      attendance
    );
  }

  getStudentAttendance(studentId: number, startDate?: string, endDate?: string): Observable<Attendance[]> {
    let url = this.appURLGenerator.getEndPoint(`${ApiEndpoints.ATTENDANCE.Actions.GetStudentAttendance}/${studentId}`);
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.httpClient.get<Attendance[]>(url);
  }
} 