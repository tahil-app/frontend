import { AttendanceStatus } from "../enums/attendance-status.enum";

export interface DailyAttendanceModel {
    date: string;
    note: string;
    status: AttendanceStatus;
}