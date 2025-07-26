import { Routes } from "@angular/router";
import { TeachersList } from "./components/teachers-list/teachers-list";
import { TeacherProfile } from "./components/teacher-profile/teacher-profile";

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    component: TeachersList
  },
  {
    path: ':id',
    component: TeacherProfile
  }
];