import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DatatableModule } from '../../shared/components/datatable/datatable.module';
import { DetailModule } from '../../shared/components/detail/detail.module';
import { SalesHistoryItemComponent } from './sales-history-item/sales-history-item.component';
import { SalesHistoryRoutingModule } from './sales-history-routing.module';
import { SalesHistoryComponent } from './sales-history.component';

@NgModule({
  declarations: [SalesHistoryComponent, SalesHistoryItemComponent],
  imports: [
    CommonModule,
    DatatableModule,
    SalesHistoryRoutingModule,
    TranslateModule,
    DetailModule,
  ],
})
export class SalesHistoryModule {}
