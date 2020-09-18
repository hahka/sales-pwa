import { Component, ViewChild } from '@angular/core';
import { Sale } from 'src/app/shared/models/market-sales.model';
import { STOCK_CATEGORIES as SC, STOCK_FUNCTIONALITIES } from 'src/app/utils/enums';
import { StockAction, StockComponent } from '../stock/stock.component';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
})
export class SaleComponent {
  @ViewChild(StockComponent, { static: true }) stockComponent: StockComponent;

  StockAction = StockAction;

  sale: Sale;

  currentPrice: number;

  stockFunctionnality = STOCK_FUNCTIONALITIES.MARKET;

  categories: SC[] = [SC.FRESH, SC.SMALL_FREEZER, SC.PASTEURIZED];

  get computeTva() {
    return ((this.currentPrice * 5.5) / 100).toFixed(2);
  }

  onClick(action: StockAction) {
    if (action === StockAction.SAVE) {
      if (this.stockComponent) {
        this.stockComponent.updateStock();
      }
    }
  }

  onSaleUpdate(sale: Sale) {
    this.sale = sale;
    if (this.sale) {
      this.currentPrice = 0;
      this.sale.items.forEach((saleItem) => {
        this.currentPrice += saleItem.price;
      });
      this.currentPrice -= this.sale.discount || 0;
    }
  }
}
