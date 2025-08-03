import { Routes } from '@angular/router';
import { UiControls } from './features/ui-controls/ui-controls';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: UiControls
    },
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
        loadChildren: () => import('./features/lesson-schedules/lesson-schedules.routes').then(m => m.LESSON_SCHEDULE_ROUTES),
        canActivate: [AuthGuard]
    }
];
