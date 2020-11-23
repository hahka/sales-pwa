import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  start: FormControl;
  end: FormControl;

  public get disabled() {
    return !this.data.marketId || !this.data.categories || !this.data.categories.length;
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

    this.start = new FormControl(new Date(data.startDate));

    if (data.endDate) {
      this.end = new FormControl(data.endDate);
    } else {
      this.end = new FormControl();
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    this.dialogRef.close({
      ...this.data,
      marketName: this.markets.find((market) => this.data.marketId === market.id)?.name,
      startDate: this.start.value.toISOString(),
      endDate: this.end.value ? this.end.value.toISOString() : null,
    });
  }

  public translateCategoryName(category: PC) {
    return this.translateService.instant(`categories.product.${category}`);
  }
}
