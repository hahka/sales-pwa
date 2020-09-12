import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StockModule } from '../stock/stock.module';
import { ProduceComponent } from './produce.component';

@NgModule({
  declarations: [ProduceComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProduceComponent,
      },
    ]),
    StockModule,
    TranslateModule,
  ],
})
export class ProduceModule {}
