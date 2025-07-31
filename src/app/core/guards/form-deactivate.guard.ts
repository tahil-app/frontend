import { CanDeactivateFn } from "@angular/router";
import { ConfirmLeaveService } from "../../features/shared/services/confirm-leave-service";
import { inject } from "@angular/core";

export const canDeactivateForm = <T extends { dirty?: boolean }>(
  component: T
): CanDeactivateFn<T> => () => {
  const confirmLeaveService = inject(ConfirmLeaveService);

  if (!component.dirty) {
    return true;
  }

  return new Promise<boolean>(resolve => {
    confirmLeaveService.confirm(
      () => resolve(true),
      () => resolve(false)
    );
  });
};