import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './clear-object-stores-warning-dialog.component.html',
  styleUrls: ['./clear-object-stores-warning-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearObjectStoresWarningDialogComponent {
  constructor(public dialogRef: MatDialogRef<ClearObjectStoresWarningDialogComponent, boolean>) {}

  cancel() {
    this.dialogRef.close(false);
  }
  confirm() {
    this.dialogRef.close(true);
  }
}
