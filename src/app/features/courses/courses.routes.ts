import { Routes } from '@angular/router';
import { CoursesListComponent } from './components/courses-list/courses-list';

export const COURSES_ROUTES: Routes = [
    {
        path: '',
        component: CoursesListComponent
    }
];
