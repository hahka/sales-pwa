import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SyncRoutingModule } from './sync-routing.module';
import { ClearObjectStoresWarningDialogComponent } from './sync/clear-object-stores-warning-dialog/clear-object-stores-warning-dialog.component';
import { SyncComponent } from './sync/sync.component';

@NgModule({
  declarations: [SyncComponent, ClearObjectStoresWarningDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, SyncRoutingModule],
})
export class SyncModule {}
