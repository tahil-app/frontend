import { Routes } from '@angular/router';
import { CoursesList } from './components/courses-list/courses-list';

export const COURSES_ROUTES: Routes = [
    {
        path: '',
        component: CoursesList
    }
];
