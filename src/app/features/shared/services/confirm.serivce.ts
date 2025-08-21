import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {

    private translate = inject(TranslateService);
    private confirmService = inject(ConfirmationService);

    confirm(
        message: string,
        acceptCallback: () => void,
        rejectCallback?: () => void,
        icon: string = "pi pi-info-circle",
    ): void {
        this.confirmService.confirm({
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

    confirmActivate(
        acceptCallback: () => void,
        message?: string,
    ): void {
        this.confirm(
            message || this.translate.instant('shared.dialogs.activateConfirmation'), 
            acceptCallback,
            undefined,
            "pi pi-power-off text-success"
        );
    }

    confirmDeactivate(
        acceptCallback: () => void,
        message?: string,
    ): void {
        this.confirm(
            message || this.translate.instant('shared.dialogs.deactivateConfirmation'), 
            acceptCallback,
            undefined,
            "pi pi-power-off text-danger"
        );
    }

    confirmDelete(
        acceptCallback: () => void,
        message?: string,
    ): void {
        this.confirm(
            message || this.translate.instant('shared.dialogs.deleteConfirmation'), 
            acceptCallback,
            undefined,
            "pi pi-trash text-danger"
        );
    }

    confirmEdit(
        acceptCallback: () => void,
        message?: string,
    ): void {
        this.confirm(
            message || this.translate.instant('shared.dialogs.editConfirmation'), 
            acceptCallback,
            undefined,
            "pi pi-pencil text-secondary"
        );
    }


    confirmPrint(
        acceptCallback: () => void, 
        message?: string
    ): void {
        this.confirm(
            message || this.translate.instant('shared.dialogs.printConfirmation'),
            acceptCallback,
            undefined,
            'pi pi-print text-primary'
        );
    }

    confirmView(
        acceptCallback: () => void,
        message?: string
    ): void {
        this.confirm(
            message || this.translate.instant('shared.dialogs.viewConfirmation'),
            acceptCallback,
            undefined,
            'pi pi-eye text-info'
        );
    }
}