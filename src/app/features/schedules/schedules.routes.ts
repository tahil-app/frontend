import { Routes } from '@angular/router';
import { SchedulsCalendar } from './components/scheduls-calendar/scheduls-calendar';

export const SCHEDULES_ROUTES: Routes = [
    {
        path: '',
        component: SchedulsCalendar
    }
];
