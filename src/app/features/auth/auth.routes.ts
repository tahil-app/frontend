import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgetPassword } from './components/forget-password/forget-password';
import { TitleResolver } from '../../core/resolvers/title.resolver';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'AUTH.LOGIN',
            translateTitle: true
        }
    },
    {
        path: 'forgot-password',
        component: ForgetPassword,
        resolve: { title: TitleResolver },
        data: {
            subtitle: 'AUTH.FORGOT_PASSWORD',
            translateTitle: true
        }
    }
];
