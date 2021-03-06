import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsDialogModule } from 'src/app/shared/components/settings-dialog/settings-dialog.module';
import { ConfirmationDialogModule } from '../../shared/components/confirmation-dialog/confirmation-dialog.module';
import { DatatableModule } from '../../shared/components/datatable/datatable.module';
import { DetailModule } from '../../shared/components/detail/detail.module';
import { SalesHistoryItemComponent } from './sales-history-item/sales-history-item.component';
import { SalesHistoryRoutingModule } from './sales-history-routing.module';
import { SalesHistoryComponent } from './sales-history.component';

@NgModule({
  declarations: [SalesHistoryComponent, SalesHistoryItemComponent],
  imports: [
    CommonModule,
    ConfirmationDialogModule,
    DatatableModule,
    DetailModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    SalesHistoryRoutingModule,
    SettingsDialogModule,
    TranslateModule,
  ],
})
export class SalesHistoryModule {}
