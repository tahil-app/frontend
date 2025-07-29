import { Routes } from '@angular/router';
import { GroupsList } from './components/groups-list/groups-list';

export const GROUPS_ROUTES: Routes = [
    {
        path: '',
        component: GroupsList
    }
];
