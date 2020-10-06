import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SyncRoutingModule } from './sync-routing.module';
import { SyncComponent } from './sync/sync.component';

@NgModule({
  declarations: [SyncComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, SyncRoutingModule],
})
export class SyncModule {}
