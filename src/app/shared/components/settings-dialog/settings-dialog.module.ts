import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SettingsDialogComponent } from './settings-dialog.component';

@NgModule({
  declarations: [SettingsDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatSelectModule],
  exports: [SettingsDialogComponent],
})
export class SettingsDialogModule {}
