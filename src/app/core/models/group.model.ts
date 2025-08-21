import { DayOfWeek } from "../enums/day-week.enum";
import { Course } from "./course.model";
import { Student } from "./student.model";
import { Teacher } from "./teacher.model";

export interface Group {
    id: number;
    name: string;
    courseId: number;
    teacherId: number;
    capacity: number;
    numberOfStudents: number;

    teacher?: Teacher;
    course?: Course;
    students?: Student[];
    dailySchedules?: GroupDailySchedule[];
    attendces? : GroupAttendance[];
}


export interface GroupDailySchedule 
{
    day: DayOfWeek;
    startTime: string | null;
    endTime: string | null;
    roomeName: string | null;
}


export interface GroupAttendance {
    sessionId: number;
    date: Date;
    present: number;
    late: number;
    absent: number;
}
