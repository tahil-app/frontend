import { LessonSessionStatus } from "../enums/lesson-session-status.enum";

export class StatusHelper {
    static getStatusBadge(status: LessonSessionStatus): { value: string; severity: 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' } {
        switch (status) {
            case LessonSessionStatus.Scheduled:
                return { value: 'sessions.status.scheduled', severity: 'info' };
            case LessonSessionStatus.Completed:
                return { value: 'sessions.status.completed', severity: 'success' };
            case LessonSessionStatus.cancelled:
                return { value: 'sessions.status.cancelled', severity: 'danger' };
            default:
        }
        return { value: 'sessions.status.unknown', severity: 'secondary' };
    }
}