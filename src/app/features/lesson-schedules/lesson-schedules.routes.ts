import { Routes } from '@angular/router';
import { SchedulesList } from './components/schedules-list/schedules-list';
import { ScheduleForm } from './components/schedule-form/schedule-form';
import { canDeactivateScheduleForm } from './guards/schedule-form-deactivate.guard';
import { canDeactivateForm } from '../../core/guards/form-deactivate.guard';

export const LESSON_SCHEDULE_ROUTES: Routes = [
    {
        path: '',
        component: SchedulesList
    },
    {
        path: ':id',
        component: ScheduleForm,
        canDeactivate: [canDeactivateScheduleForm]
    },
    {
        path: 'form',
        component: ScheduleForm,
        canDeactivate: [canDeactivateForm]
    }
];
