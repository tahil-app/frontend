import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {
    constructor(private confirmationService: ConfirmationService) { }

    confirm(
        message: string,
        acceptCallback: () => void,
        rejectCallback?: () => void,
        icon: string = "pi pi-info-circle",
    ): void {
        this.confirmationService.confirm({
            key: 'deleteConfirmDialog',
            message: message,
            icon: icon,
            acceptLabel: 'نعم',
            rejectLabel: 'إلغاء',
            accept: () => {
                acceptCallback();
            },
            reject: () => {
                if (rejectCallback) {
                    rejectCallback();
                }
            },
        });
    }
}