import { CanDeactivateFn } from "@angular/router";
import { ScheduleForm } from "../components/schedule-form/schedule-form";
import { inject } from "@angular/core";
import { ConfirmLeaveService } from "../../shared/services/confirm-leave-service";

export const canDeactivateScheduleForm: CanDeactivateFn<ScheduleForm> = (component) => {
    
    const confirmLeaveService = inject(ConfirmLeaveService);

    if (!component.scheduleForm.dirty) {
        return true;
    }

    return new Promise<boolean>(resolve => {
        confirmLeaveService.confirm(
            () => resolve(true),
            () => resolve(false)
        );
    });
}