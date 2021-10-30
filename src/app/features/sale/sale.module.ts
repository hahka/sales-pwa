import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsDialogModule } from '../../shared/components/settings-dialog/settings-dialog.module';
import { SalesHistoryItemComponent } from '../sales-history/sales-history-item/sales-history-item.component';
import { SalesHistoryItemModule } from '../sales-history/sales-history-item/sales-history-item.module';
import { StockModule } from '../stock/stock.module';
import { NotReadyDialogModule } from './not-ready-dialog/not-ready-dialog.module';
import { SaleConfirmationDialogModule } from './sale-confirmation-dialog/sale-confirmation-dialog.module';
import { SaleComponent } from './sale.component';

@NgModule({
  declarations: [SaleComponent],
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SaleComponent,
      },
      {
        path: 'history',
        component: SalesHistoryItemComponent,
        data: { displayCurrentSales: true },
      },
    ]),
    SettingsDialogModule,
    StockModule,
    TranslateModule,
    SaleConfirmationDialogModule,
    NotReadyDialogModule,
    SalesHistoryItemModule,
  ],
})
export class SaleModule {}
