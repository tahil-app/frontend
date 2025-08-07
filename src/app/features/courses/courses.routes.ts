import { Routes } from '@angular/router';
import { CoursesList } from './components/courses-list/courses-list';
import { CourseProfile } from './components/course-profile/course-profile';

export const COURSES_ROUTES: Routes = [
    {
        path: '',
        component: CoursesList
    },
    {
        path: ':id',
        component: CourseProfile
    }
];
