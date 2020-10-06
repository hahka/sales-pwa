import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-close-market-dialog',
  templateUrl: './close-market-dialog.component.html',
  styleUrls: ['./close-market-dialog.component.scss'],
})
export class CloseMarketDialogComponent {
  constructor(public dialogRef: MatDialogRef<CloseMarketDialogComponent>) {}

  onClick(confirm?: boolean): void {
    this.dialogRef.close({ confirm });
  }
}
