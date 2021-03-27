import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [MatDialogModule],
  entryComponents: [ConfirmationDialogComponent],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    ConfirmationDialogService,
  ],
})
export class ConfirmationDialogModule {}
