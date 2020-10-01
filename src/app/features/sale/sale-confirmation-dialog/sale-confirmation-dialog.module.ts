import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { SaleConfirmationDialogComponent } from './sale-confirmation-dialog.component';

@NgModule({
  declarations: [SaleConfirmationDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [SaleConfirmationDialogComponent],
})
export class SaleConfirmationDialogModule {}
