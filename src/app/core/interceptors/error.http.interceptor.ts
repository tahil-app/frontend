import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ToastService } from "../../features/shared/services/toast.service";
import { LoaderService } from "../../features/shared/services/loader.service";

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

    // Server-side errors
    switch (error.status) {
        case 0:
            return 'Failed to connect to the API server. Please check your network connection.';
        case 400:
            return getValidationErrors(error) || 'Invalid request. Please check your input.';
        case 401:
            return 'Session expired. Please log in again.';
        case 403:
            return 'You don\'t have permission to perform this action.';
        case 404:
            return 'The requested resource was not found.';
        default:
            return getServerErrorMessage(error) || 'An unexpected error occurred.';
    }
}

function getValidationErrors(error: HttpErrorResponse): string | null {
    if (error.error?.errors) {
        return Object.values(error.error.errors)
            .flat()
            .join('\n');
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