import { Routes } from "@angular/router";
import { LayoutDashboard } from "./components/layout-dashboard/layout-dashboard";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: LayoutDashboard,
    }
];
