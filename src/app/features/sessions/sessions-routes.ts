import { Routes } from "@angular/router";
import { SessionsList } from "./components/sessions-list/sessions-list";
import { SessionAttendance } from "./components/session-attendance/session-attendance";
import { canDeactivateForm } from "../../core/guards/form-deactivate.guard";

export const SESSIONS_ROUTES: Routes = [
    {
        path: '',
        component: SessionsList
    },
    {
        path: ':sessionId/attendance',
        component: SessionAttendance,
        canDeactivate: [canDeactivateForm]
      }
]