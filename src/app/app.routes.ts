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
    }
];
