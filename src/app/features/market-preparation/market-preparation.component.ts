import { Component, ViewChild } from '@angular/core';
import { STOCK_CATEGORIES as SC, STOCK_FUNCTIONALITIES } from 'src/app/utils/enums';
import { StockComponent } from '../stock/stock.component';

export enum Action {
  SAVE = 'SAVE',
}

@Component({
  selector: 'app-market-preparation',
  templateUrl: './market-preparation.component.html',
  styleUrls: ['./market-preparation.component.scss'],
})
export class MarketPreparationComponent {
  @ViewChild(StockComponent, { static: true }) stockComponent: StockComponent;

  stockFunctionnality = STOCK_FUNCTIONALITIES.MARKET_PREPARATION;

  Action = Action;
  categories: SC[] = [SC.FRESH, SC.SMALL_FREEZER, SC.PASTEURIZED];

  onClick(producingAction: Action) {
    if (producingAction === Action.SAVE) {
      if (this.stockComponent) {
        this.stockComponent.updateStock();
      }
    }
  }
}
