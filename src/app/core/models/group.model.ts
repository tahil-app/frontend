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
}