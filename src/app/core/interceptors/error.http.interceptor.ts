import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    URL: string = '';
    constructor(private messageService: MessageService, private route: Router,
        private ngxService: NgxUiLoaderService
    ) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.ngxService.stop();
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;


                    } else {
                        // server-side error
                        if (error.status == 0) {
                            errorMessage = `Failed to connect to the back end API`

                        }
                        else {
                            if (error.error instanceof Blob) {
                                this.blobToText(error.error).subscribe((e: string) => {
                                    var _error = JSON.parse(e.toString());
                                    errorMessage = `error : ${_error.message} ${_error.exception}`
                                    this.messageService.add({ severity: 'error', summary: errorMessage });
                                })
                            }
                            return throwError(() => error);
                        }
                    }

                    if (errorMessage !== '') {
                        this.messageService.add({ severity: 'error', summary: errorMessage });
                    }

                    return throwError(() => error);
                }))
    }

    blobToText(blob: any): Observable<string> {
        return new Observable<string>((observer) => {
            if (!blob) {
                observer.next("");
                observer.complete();
            } else {
                let reader = new FileReader();
                reader.onload = event => {
                    observer.next((<any>event.target).result);
                    observer.complete();
                };
                reader.readAsText(blob);
            }
        });
    }
}