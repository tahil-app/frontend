import { inject, Injectable } from "@angular/core";
import { ConfirmService } from "./confirm.serivce";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDeleteService {
    
    private confirmService = inject(ConfirmService);
    private translateService = inject(TranslateService);
    private defaultMessage = this.translateService.instant('shared.dialogs.deleteConfirmation');

    confirm(
        confirmCallback: () => void, 
        customMessage?: string
    ): void {
        this.confirmService.confirm(
            customMessage || this.defaultMessage,
            () => confirmCallback(),
            undefined,
            'pi pi-trash text-danger mb-4'
        );
    }

}
