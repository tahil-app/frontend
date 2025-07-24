import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private messageService: MessageService) {}

    showSuccess(message: string) {
        this.messageService.add({ severity: 'success', summary: 'نجاح', detail: message });
    }

    showInfo(message: string) {
        this.messageService.add({ severity: 'info', summary: 'معلومة', detail: message });
    }

    showWarn(message: string) {
        this.messageService.add({ severity: 'warn', summary: 'تحذير', detail: message });
    }

    showError(message: string) {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: message });
    }

    showGeneralErr() {
        this.showError('Something wrong happend');
    }
}