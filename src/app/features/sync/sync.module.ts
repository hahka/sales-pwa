import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogModule } from '../../shared/components/confirmation-dialog/confirmation-dialog.module';
import { SyncRoutingModule } from './sync-routing.module';
import { SyncComponent } from './sync/sync.component';

@NgModule({
  declarations: [SyncComponent],
  imports: [
    CommonModule,
    ConfirmationDialogModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    SyncRoutingModule,
  ],
})
export class SyncModule {}
