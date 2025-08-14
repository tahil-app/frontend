import { ClassSessionStatus } from "../enums/class-session-status.enum";

export class StatusHelper {
    static getStatusBadge(status: ClassSessionStatus): { value: string; severity: 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' } {
        switch (status) {
            case ClassSessionStatus.Scheduled:
                return { value: 'sessions.status.scheduled', severity: 'info' };
            case ClassSessionStatus.Completed:
                return { value: 'sessions.status.completed', severity: 'success' };
            case ClassSessionStatus.Cancelled:
                return { value: 'sessions.status.cancelled', severity: 'danger' };
            default:
        }
        return { value: 'sessions.status.unknown', severity: 'secondary' };
    }
}