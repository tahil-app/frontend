import { Routes } from '@angular/router';
import { UiControls } from './features/ui-controls/ui-controls';

export const routes: Routes = [
    {
        path: '',
        component: UiControls
    },
    {
        path: 'courses',
        loadChildren: () => import('./features/courses/courses.routes').then(m => m.COURSES_ROUTES)
    },
    {
        path: 'groups',
        loadChildren: () => import('./features/groups/groups.routes').then(m => m.GROUPS_ROUTES)
    },
    {
        path: 'rooms',
        loadChildren: () => import('./features/rooms/rooms.routes').then(m => m.ROOMS_ROUTES)
    },
    {
        path: 'teachers',
        loadChildren: () => import('./features/teachers/teachers.routes').then(m => m.TEACHERS_ROUTES)
    },
    {
        path: 'students',
        loadChildren: () => import('./features/students/students.routes').then(m => m.STUDENTS_ROUTES)
    },
    {
        path: 'schedules',
        loadChildren: () => import('./features/lesson-schedules/lesson-schedules.routes').then(m => m.LESSON_SCHEDULE_ROUTES)
    }
];
