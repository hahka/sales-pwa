import { Component, ViewChild } from '@angular/core';
import { STOCK_CATEGORIES as SC } from 'src/app/utils/enums';
import { StockComponent } from '../stock/stock.component';

export enum ProduceAction {
  SAVE = 'SAVE',
}

@Component({
  selector: 'app-produce',
  templateUrl: './produce.component.html',
  styleUrls: ['./produce.component.scss'],
})
export class ProduceComponent {
  @ViewChild(StockComponent, { static: true }) stockComponent: StockComponent;

  ProduceAction = ProduceAction;

  categories: SC[] = [SC.FRESH, SC.LARGE_FREEZER, SC.PASTEURIZED];

  onClick(producingAction: ProduceAction) {
    if (producingAction === ProduceAction.SAVE) {
      if (this.stockComponent) {
        this.stockComponent.updateStock();
      }
    }
  }
}
