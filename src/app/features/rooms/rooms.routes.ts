import { Routes } from '@angular/router';
import { RoomsList } from './components/rooms-list/rooms-list';

export const ROOMS_ROUTES: Routes = [
    {
        path: '',
        component: RoomsList
    }
];
