import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockModule } from '../stock/stock.module';
import { ProducingComponent } from './producing.component';

@NgModule({
  declarations: [ProducingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProducingComponent,
      },
    ]),
    StockModule,
  ],
})
export class ProducingModule {}
