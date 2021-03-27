import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from './confirmation-dialog-data.interface';
import { ConfirmationDialogResponse } from './confirmation-dialog-response.interface';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent, ConfirmationDialogResponse>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}

  onClick(confirm?: boolean | undefined): void {
    this.dialogRef.close({ confirm });
  }
}
