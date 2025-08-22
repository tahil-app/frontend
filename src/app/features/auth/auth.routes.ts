import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgetPassword } from './components/forget-password/forget-password';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'forgot-password',
        component: ForgetPassword
    }
];
