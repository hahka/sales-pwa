import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { STOCK_CATEGORIES } from 'src/app/utils/enums';

export interface ResetDialogData {
  forSale?: boolean; // TODO: Will be used later if dialog is needed for sales
  stock: STOCK_CATEGORIES;
}

@Component({
  selector: 'app-reset-stock-dialog',
  templateUrl: './reset-stock-dialog.component.html',
  styleUrls: ['./reset-stock-dialog.component.scss'],
})
export class ResetStockDialogComponent {
  warning = 'Voulez-vous vraiment remettre à zéro ce stock?';

  constructor(
    public dialogRef: MatDialogRef<ResetStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResetDialogData,
    private readonly translateService: TranslateService,
  ) {
    if (!data.forSale) {
      if (data.stock) {
        this.warning = `Voulez-vous vraiment remettre à zéro le stock suivant: ${this.translateService.instant(
          `categories.stock.${data.stock}`,
        )}`;
      } else {
        this.warning = 'Voulez-vous vraiment remettre à zéro tout le stock?';
      }
    }
  }

  onClick(response?: boolean): void {
    this.dialogRef.close(response);
  }
}
