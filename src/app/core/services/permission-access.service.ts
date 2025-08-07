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
        };
    }

    get canView() {
        return {
            groupProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher,
            studentProfile: this.authService.isAdmin || this.authService.isEmployee || this.authService.isTeacher || this.authService.isStudent,
            courseProfile: this.authService.isAdmin || this.authService.isEmployee,
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
        };
    }

    get canEdit() {
        return {
            group: this.authService.isAdmin || this.authService.isEmployee,
            student: this.authService.isAdmin || this.authService.isEmployee,
            teacher: this.authService.isAdmin || this.authService.isEmployee,
            room: this.authService.isAdmin || this.authService.isEmployee,
            course: this.authService.isAdmin || this.authService.isEmployee,
        };
    }

    get canDelete() {
        return {
            group: this.authService.isAdmin,
            student: this.authService.isAdmin,
            teacher: this.authService.isAdmin,
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
        };
    }

    get canActivate() {
        return {
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
        };
    }

    get canDeactivate() {
        return {
            room: this.authService.isAdmin,
            course: this.authService.isAdmin,
        };
    }

}
