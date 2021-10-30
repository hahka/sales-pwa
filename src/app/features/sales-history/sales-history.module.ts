import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsDialogModule } from 'src/app/shared/components/settings-dialog/settings-dialog.module';
import { DatatableModule } from '../../shared/components/datatable/datatable.module';
import { SalesHistoryItemModule } from './sales-history-item/sales-history-item.module';
import { SalesHistoryRoutingModule } from './sales-history-routing.module';
import { SalesHistoryComponent } from './sales-history.component';

@NgModule({
  declarations: [SalesHistoryComponent],
  imports: [
    CommonModule,
    DatatableModule,
    MatButtonModule,
    MatIconModule,
    SalesHistoryItemModule,
    SalesHistoryRoutingModule,
    SettingsDialogModule,
    TranslateModule,
  ],
})
export class SalesHistoryModule {}
