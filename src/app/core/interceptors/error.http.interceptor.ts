import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ToastService } from "../../features/shared/services/toast.service";
import { LoaderService } from "../../features/shared/services/loader.service";
import { TranslateService } from "@ngx-translate/core";

export function resultErrorInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
    const toastService = inject(ToastService);
    const loader = inject(LoaderService);

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            loader.hide();
            
            const errorMessage = extractErrorMessage(error);

            if (errorMessage) {
                toastService.showError(errorMessage);
            }

            return throwError(() => formatError(error));
        })
    );
}

function extractErrorMessage(error: HttpErrorResponse): string {
    // Client-side or network error
    if (error.error instanceof ErrorEvent) {
        return `Client error: ${error.error.message}`;
    }

    const translate = inject(TranslateService);

    // Server-side errors
    switch (error.status) {
        case 0:
            return 'Failed to connect to the API server. Please check your network connection.';
        case 400:
            return getValidationErrors(error) || 'Invalid request. Please check your input.';
        case 401:
            return translate.instant('shared.permissionDenied');
        case 403:
            return translate.instant('shared.permissionDenied');
        case 404:
            return 'The requested resource was not found.';
        default:
            return getServerErrorMessage(error) || 'An unexpected error occurred.';
    }
}

function getValidationErrors(error: HttpErrorResponse): string | null {
    // Check for ValidationErrors array in the response
    if (error.error?.value?.ValidationErrors?.length > 0) {
        return error.error.value.ValidationErrors
            .map((err: any) => `${err.propertyName}: ${err.errorMessage}`)
            .join('\n');
    }
    
    // Fallback to error.detail if ValidationErrors is empty
    if (error.error?.value?.detail) {
        return error.error.value.detail;
    }
    
    // Fallback to simple error message
    if (error.error?.error) {
        return error.error.error;
    }
    
    return null;
}

function getServerErrorMessage(error: HttpErrorResponse): string | null {
    return error.error?.message 
        || error.error?.error 
        || error.message;
}

function formatError(error: HttpErrorResponse): any {
    return {
        status: error.status,
        message: extractErrorMessage(error),
        originalError: error.error,
        validationErrors: error.error?.errors
    };
}