import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { NotReadyDialogComponent } from './not-ready-dialog.component';

@NgModule({
  declarations: [NotReadyDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
})
export class NotReadyDialogModule {}
