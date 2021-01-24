import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MarketsService } from '../../../core/services/features/markets.service';
import { PRODUCT_CATEGORIES as PC } from '../../../utils/enums';
import { MarketSales } from '../../models/market-sales.model';
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

  formGroup = new FormGroup({
    marketId: new FormControl('', Validators.required),
    categories: new FormControl([], Validators.required),
    startDate: new FormControl({ value: new Date(), disabled: true }, Validators.required),
    endDate: new FormControl({ value: null, disabled: true }),
    income: new FormControl(0, Validators.min(0)),
  });

  public get disabled() {
    const marketSales = this.data.marketSales;

    return (
      !marketSales ||
      !marketSales.marketId ||
      !marketSales.categories ||
      !marketSales.categories.length
    );
  }

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsDialogData,
    private readonly marketsService: MarketsService,
    private readonly translateService: TranslateService,
  ) {
    this.marketsService.getAll().subscribe((markets) => {
      this.markets = markets;
    });

    const marketSales = data.marketSales;
    if (marketSales) {
      this.formGroup.patchValue({
        marketId: marketSales.marketId,
        categories: marketSales.categories,
        income: marketSales.income,
      });

      if (marketSales.startDate) {
        this.formGroup.patchValue({
          startDate: new Date(marketSales.startDate),
        });
      }

      if (marketSales.endDate) {
        this.formGroup.patchValue({ endDate: marketSales.endDate });
      }
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    const value: MarketSales = { ...this.formGroup.getRawValue() };
    this.dialogRef.close({
      ...this.data,
      ...value,
      marketName: this.markets.find((market) => value.marketId === market.id)?.name,
    });
  }

  public translateCategoryName(category: PC) {
    return this.translateService.instant(`categories.product.${category}`);
  }
}
