import { Component, ViewChild } from '@angular/core';
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

  stockFunctionnality = STOCK_FUNCTIONALITIES.MARKET;

  categories: SC[] = [SC.FRESH, SC.SMALL_FREEZER, SC.PASTEURIZED];

  onClick(action: StockAction) {
    if (action === StockAction.SAVE) {
      if (this.stockComponent) {
        this.stockComponent.updateStock();
      }
    }
  }
}
