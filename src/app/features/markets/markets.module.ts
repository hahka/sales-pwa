import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DatatableModule } from 'src/app/shared/components/datatable/datatable.module';
import { MarketsRoutingModule } from './markets-routing.module';
import { MarketsComponent } from './markets.component';

@NgModule({
  declarations: [MarketsComponent],
  imports: [CommonModule, DatatableModule, MarketsRoutingModule, TranslateModule],
})
export class MarketsModule {}
