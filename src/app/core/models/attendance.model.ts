import { AttendanceStatus } from '../enums/attendance-status.enum';

export class Attendance {
  id: number = 0;
  sessionId: number = 0;
  studentId: number = 0;
  status: AttendanceStatus = AttendanceStatus.Present;
  notes?: string;
  
  // Navigation properties
  studentName?: string;
  studentEmail?: string;
  sessionDate?: string;
  courseName?: string;
  groupName?: string;
} 