import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'courses',
        loadChildren: () => import('./features/courses/courses.routes').then(m => m.COURSES_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'groups',
        loadChildren: () => import('./features/groups/groups.routes').then(m => m.GROUPS_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'rooms',
        loadChildren: () => import('./features/rooms/rooms.routes').then(m => m.ROOMS_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'teachers',
        loadChildren: () => import('./features/teachers/teachers.routes').then(m => m.TEACHERS_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'students',
        loadChildren: () => import('./features/students/students.routes').then(m => m.STUDENTS_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'schedules',
        loadChildren: () => import('./features/schedules/schedules.routes').then(m => m.SCHEDULES_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'sessions',
        loadChildren: () => import('./features/sessions/sessions-routes').then(m => m.SESSIONS_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'error',
        loadChildren: () => import('./features/error-pages/error-pages.routes').then(m => m.ERROR_PAGES_ROUTES)
    },
    {
        path: '**',
        redirectTo: '/error/404'
    }
];
