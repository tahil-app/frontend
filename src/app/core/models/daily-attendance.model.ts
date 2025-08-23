import { AttendanceStatus } from "../enums/attendance-status.enum";

export interface DailyAttendanceModel {
    date: string;
    startTime: string | null;
    endTime: string | null;
    note: string;
    status: AttendanceStatus;
    courseName: string
}