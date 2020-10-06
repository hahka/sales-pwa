import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sale } from 'src/app/shared/models/market-sales.model';
import { computeTva } from 'src/app/utils/utils';

export interface SaleConfirmationDialogData {
  price: number;
  sale: Sale;
}

@Component({
  selector: 'app-sale-confirmation-dialog',
  templateUrl: './sale-confirmation-dialog.component.html',
  styleUrls: ['./sale-confirmation-dialog.component.scss'],
})
export class SaleConfirmationDialogComponent {
  price: number;
  tva: string;

  discount = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<SaleConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SaleConfirmationDialogData,
  ) {
    this.computePrice();

    this.discount.valueChanges.subscribe((value) => {
      this.computePrice(value);
    });
  }

  onClick(confirm?: boolean): void {
    this.dialogRef.close({ confirm, discount: this.discount.value });
  }

  private computePrice(discount?: number) {
    const data = this.data;
    if (data && data.sale && data.sale.items) {
      this.price = data.sale.items
        .map((val) => val.price)
        .reduce((acc, val) => {
          return acc + val;
        });
      if (discount) {
        this.price -= discount;
      }
      this.tva = computeTva(this.price);
    }
  }
}
