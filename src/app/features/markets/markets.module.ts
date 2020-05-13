import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DatatableModule } from 'src/app/shared/components/datatable/datatable.module';
import { DetailModule } from 'src/app/shared/components/detail/detail.module';
import { MarketsDetailComponent } from './markets-detail/markets-detail.component';
import { MarketsRoutingModule } from './markets-routing.module';
import { MarketsComponent } from './markets.component';

@NgModule({
  declarations: [MarketsComponent, MarketsDetailComponent],
  imports: [CommonModule, DatatableModule, MarketsRoutingModule, TranslateModule, DetailModule],
})
export class MarketsModule {}
