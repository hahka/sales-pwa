import { Component, ViewChild } from '@angular/core';
import { STOCK_CATEGORIES as SC } from 'src/app/utils/enums';
import { StockAction, StockComponent } from '../stock/stock.component';

@Component({
  selector: 'app-produce',
  templateUrl: './produce.component.html',
  styleUrls: ['./produce.component.scss'],
})
export class ProduceComponent {
  @ViewChild(StockComponent, { static: true }) stockComponent: StockComponent;

  StockAction = StockAction;

  categories: SC[] = [SC.FRESH, SC.LARGE_FREEZER, SC.SMALL_FREEZER, SC.PASTEURIZED];

  onClick(producingAction: StockAction) {
    if (producingAction === StockAction.SAVE) {
      if (this.stockComponent) {
        this.stockComponent.updateStock();
      }
    }
  }
}
