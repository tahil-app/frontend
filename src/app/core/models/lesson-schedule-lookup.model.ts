import { Course } from "./course.model";
import { Group } from "./group.model";
import { Room } from "./room.model";
import { Teacher } from "./teacher.model";

export interface LessonScheduleLookup {
    rooms: Room[];
    groups: Group[];
    courseTeachers: CourseTeachers[];
}

export interface CourseTeachers {
    course: Course;
    teachers: Teacher[];
}