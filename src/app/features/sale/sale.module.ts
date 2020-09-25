import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsDialogModule } from '../../shared/components/settings-dialog/settings-dialog.module';
import { StockModule } from '../stock/stock.module';
import { NotReadyDialogComponent } from './not-ready-dialog/not-ready-dialog.component';
import { SaleComponent } from './sale.component';

@NgModule({
  declarations: [SaleComponent, NotReadyDialogComponent],
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SaleComponent,
      },
    ]),
    SettingsDialogModule,
    StockModule,
    TranslateModule,
  ],
})
export class SaleModule {}
