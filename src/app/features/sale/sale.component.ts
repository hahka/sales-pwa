import { Component, ViewChild } from '@angular/core';
import { STOCK_FUNCTIONALITIES } from 'src/app/utils/enums';
import { StockComponent } from '../stock/stock.component';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
})
export class SaleComponent {
  @ViewChild(StockComponent, { static: true }) stockComponent: StockComponent;

  stockFunctionnality = STOCK_FUNCTIONALITIES.MARKET;
}
