import { DayOfWeek } from "../enums/day-week.enum";
import { LessonScheduleStatus } from "../enums/lesson-schedule-status.enum";

export interface LessonSchedule {
    id: string;
    roomId: number;
    courseId: number;
    teacherId: number;
    groupId: number;
    referenceId: number;

    day: DayOfWeek;
    startTime: string;
    endTime: string;

    startDate: string;
    endDate: string;
    status: LessonScheduleStatus;

    createdAt: string;
    updatedAt: string;

    createdBy: string;
    updatedBy: string;
}