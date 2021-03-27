import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Service used to catch any errors and handle those in one place.
 * This is overridden by any error callback on the app.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptorHandler implements ErrorHandler {
  private toastrService: ToastrService;
  constructor(private readonly injector: Injector) {}
  /**
   * Handle the global errors.
   */
  handleError(error: any): void {
    this.toastrService = this.injector.get(ToastrService);
    // If the error is an API error ...
    if (error instanceof HttpErrorResponse) {
      this.toastrService.error(error.message, error.name);
    } else console.error(error); // Log the error if it is not an API or network error.
  }
}
