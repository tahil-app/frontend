import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionAccessService {

    private authService = inject(AuthService);

    get canViewSideNav() {
        return {
            groups: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            students: this.authService.isAdmin || this.authService.isEmployee,
            teachers: this.authService.isAdmin || this.authService.isEmployee,
            rooms: this.authService.isAdmin,
            courses: this.authService.isAdmin,
            schedules: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher || this.authService.isStudent,
            sessions: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher || this.authService.isStudent,
        };
    }

    get canExport() {
        return {
            exportAttendancePdf: this.authService.isAdmin || this.authService.isEmployee,
            exportSchedulePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher || this.authService.isStudent,
            exportSessionsPdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher || this.authService.isStudent,
            exportStudentDailySchedulePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isStudent,
            exportTeacherDailySchedulePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            exportGroupDailySchedulePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            exportStudentAttendancePdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isStudent,
            exportStudentFeedbackPdf: this.authService.isAdmin || this.authService.isEmployee || this.authService.isStudent
        };
    }

    get canView() {
        return {
            groupProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            studentProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isStudent,
            courseProfile: this.authService.isAdmin || this.authService.isEmployee,
            teacherProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            studentSchedule: this.authService.isAdmin || this.authService.isEmployee || this.authService.isStudent,
            studentAttendance: this.authService.isAdmin || this.authService.isEmployee || this.authService.isStudent
        };
    }

    get canViewPagedAdminColumns() {
        return {
            group: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canAdd() {
        return {
            group: this.authService.isAdmin || this.authService.isEmployee,
            student: this.authService.isAdmin || this.authService.isEmployee,
            teacher: this.authService.isAdmin || this.authService.isEmployee,
            room: this.authService.isAdmin || this.authService.isEmployee,
            course: this.authService.isAdmin || this.authService.isEmployee,
            schedule: this.authService.isAdmin || this.authService.isEmployee,
            refreshSessions: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canEdit() {
        return {
            group: this.authService.isAdmin || this.authService.isEmployee,
            room: this.authService.isAdmin || this.authService.isEmployee,
            course: this.authService.isAdmin || this.authService.isEmployee,
            teacher: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            teacherOnlyAdminOrEmployee: this.authService.isAdmin || this.authService.isEmployee,
            teacherCourses: this.authService.isAdmin || this.authService.isEmployee,
            student: this.authService.isAdmin || this.authService.isEmployee || this.authService.isStudent,
            studentOnlyAdminOrEmployee: this.authService.isAdmin || this.authService.isEmployee,
            schedule: this.authService.isAdmin || this.authService.isEmployee,
            session: this.authService.isAdmin || this.authService.isEmployee,
            recordStudentAttendance: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            studentAttendance: this.authService.isAdmin || this.authService.isEmployee,
            studentAttendanceToBeRescheduled: this.authService.isAdmin || this.authService.isEmployee,
            studentAttendanceToBeCancelled: this.authService.isAdmin || this.authService.isEmployee,
            studentAttendanceToRecord: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            studentAttendanceToBeCompleted: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
        };
    }

    get canDelete() {
        return {
            group: this.authService.isAdmin,
            student: this.authService.isAdmin,
            teacher: this.authService.isAdmin,
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
            schedule: this.authService.isAdmin,
            session: this.authService.isAdmin,
        };
    }

    get canActivate() {
        return {
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
            teacher: this.authService.isAdmin,
            student: this.authService.isAdmin,
        };
    }

    get canDeactivate() {
        return {
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
            teacher: this.authService.isAdmin,
            student: this.authService.isAdmin,
        };
    }

    get canDownload() {
        return {
            studentAttachment: this.authService.isAdmin || this.authService.isEmployee || this.authService.isStudent,
        };
    }
}
