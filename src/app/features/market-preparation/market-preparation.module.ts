import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogModule } from '../../shared/components/confirmation-dialog/confirmation-dialog.module';
import { SettingsDialogModule } from '../../shared/components/settings-dialog/settings-dialog.module';
import { StockModule } from '../stock/stock.module';
import { MarketPreparationComponent } from './market-preparation.component';

@NgModule({
  declarations: [MarketPreparationComponent],
  imports: [
    ConfirmationDialogModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MarketPreparationComponent,
      },
    ]),
    SettingsDialogModule,
    StockModule,
    TranslateModule,
  ],
})
export class MarketPreparationModule {}
