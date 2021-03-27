import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogData } from './confirmation-dialog-data.interface';
import { ConfirmationDialogResponse } from './confirmation-dialog-response.interface';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private readonly matDialog: MatDialog) {}

  openConfirmationDialog(title: string, line1: string, line2?: string) {
    return this.matDialog
      .open<ConfirmationDialogComponent, ConfirmationDialogData, ConfirmationDialogResponse>(
        ConfirmationDialogComponent,
        {
          data: {
            title,
            line1,
            line2,
          },
        },
      )
      .afterClosed()
      .pipe(filter((response) => !!response && !!response.confirm));
  }
}
