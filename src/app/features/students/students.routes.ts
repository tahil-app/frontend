import { Routes } from "@angular/router";
import { StudentsList } from "./components/students-list/students-list";
import { StudentProfile } from "./components/student-profile/student-profile";
import { StudentData } from "./components/student-data/student-data";

export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    component: StudentsList
  },
  {
    path: ':id',
    component: StudentProfile
  },
  {
    path: ':id/data',
    component: StudentData
  }
];