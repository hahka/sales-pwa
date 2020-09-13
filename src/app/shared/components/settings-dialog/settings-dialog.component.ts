import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MarketsService } from '../../../core/services/features/markets.service';
import { PRODUCT_CATEGORIES as PC } from '../../../utils/enums';
import { Market } from '../../models/market.model';
import { SettingsDialogData } from './settings-dialog-data.model';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent {
  pCategories = [PC.FRESH, PC.FROZEN, PC.PASTEURIZED];
  markets: Market[];

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsDialogData,
    private readonly marketsService: MarketsService,
    private readonly translateService: TranslateService,
  ) {
    this.marketsService.getAll().subscribe((markets) => {
      this.markets = markets;
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.dialogRef.close({
      ...this.data,
      marketName: this.markets.find((market) => this.data.marketId === market.id)?.name,
    });
  }

  translateCategoryName(category: PC) {
    return this.translateService.instant(`categories.product.${category}`);
  }
}
