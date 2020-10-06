import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-not-ready-dialog',
  templateUrl: './not-ready-dialog.component.html',
  styleUrls: ['./not-ready-dialog.component.scss'],
})
export class NotReadyDialogComponent {
  constructor(public dialogRef: MatDialogRef<NotReadyDialogComponent>) {}

  onClick(): void {
    this.dialogRef.close();
  }
}
