import { Routes } from '@angular/router';
import { GroupsList } from './components/groups-list/groups-list';
import { GroupProfile } from './components/group-profile/group-profile';

export const GROUPS_ROUTES: Routes = [
    {
        path: '',
        component: GroupsList
    },
    {
        path: ':id',
        component: GroupProfile
    }
];
