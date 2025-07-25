import { Routes } from "@angular/router";
import { TeachersList } from "./components/teachers-list/teachers-list";

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    component: TeachersList
  }
];