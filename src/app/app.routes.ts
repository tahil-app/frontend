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
        path: 'rooms',
        loadChildren: () => import('./features/rooms/rooms.routes').then(m => m.ROOMS_ROUTES)
    },
    {
        path: 'teachers',
        loadChildren: () => import('./features/teachers/teachers.routes').then(m => m.TEACHERS_ROUTES)
    }
];
