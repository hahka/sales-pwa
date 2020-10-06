import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ResetStockDialogComponent } from './reset-stock-dialog.component';

@NgModule({
  declarations: [ResetStockDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [ResetStockDialogComponent],
})
export class ResetStockDialogModule {}
