import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogModule } from '../../../shared/components/confirmation-dialog/confirmation-dialog.module';

import { DetailModule } from '../../../shared/components/detail/detail.module';
import { SalesHistoryItemComponent } from './sales-history-item.component';

@NgModule({
  declarations: [SalesHistoryItemComponent],
  imports: [
    CommonModule,
    ConfirmationDialogModule,
    DetailModule,
    MatButtonModule,
    MatDividerModule,
    TranslateModule,
  ],
  exports: [SalesHistoryItemComponent],
})
export class SalesHistoryItemModule {}
