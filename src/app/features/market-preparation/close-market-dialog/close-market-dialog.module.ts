import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CloseMarketDialogComponent } from './close-market-dialog.component';

@NgModule({
  declarations: [CloseMarketDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [CloseMarketDialogComponent],
})
export class CloseMarketDialogModule {}
