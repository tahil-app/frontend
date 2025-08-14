import { LessonSessionStatus } from "../enums/lesson-session-status.enum";

export class ClassSession {
    id!: number;
    date!: string | null;
    scheduleId!: number;
    status!: LessonSessionStatus;
    teacherId!: number;
    roomId!: number;
    startTime?: string | null;
    endTime?: string | null;

    roomName?: string;
    groupName?: string;
    courseName?: string;
    teacherName?: string;
}