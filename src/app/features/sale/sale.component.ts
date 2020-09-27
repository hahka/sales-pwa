import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MarketSalesService } from '../../core/services/features/market-sales.service';
import { MarketSalesComponent } from '../../shared/components/market-sales/market-sales.component';
import { Sale } from '../../shared/models/market-sales.model';
import { AppRoutes, STOCK_FUNCTIONALITIES } from '../../utils/enums';
import { StockAction, StockComponent } from '../stock/stock.component';
import { NotReadyDialogComponent } from './not-ready-dialog/not-ready-dialog.component';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
})
export class SaleComponent extends MarketSalesComponent {
  @ViewChild(StockComponent, { static: true }) stockComponent: StockComponent;

  StockAction = StockAction;

  sale: Sale;

  currentPrice: number;

  SF = STOCK_FUNCTIONALITIES;

  get computeTva() {
    return ((this.currentPrice * 5.5) / 100).toFixed(2);
  }

  constructor(
    protected readonly matDialog: MatDialog,
    protected readonly marketSalesService: MarketSalesService,
    private readonly router: Router,
  ) {
    super(matDialog, marketSalesService);
  }

  marketNotReadyHandler(): void {
    const dialogRef = this.matDialog.open(NotReadyDialogComponent);

    dialogRef.afterClosed().subscribe((_) => {
      this.router.navigate(['..', AppRoutes.MARKET_PREPARATION]);
    });
  }

  onClick(action: StockAction) {
    switch (action) {
      case StockAction.SAVE:
        if (this.stockComponent) {
          this.stockComponent.updateStock();
        }
        break;
      case StockAction.RESET_ALL:
        if (this.stockComponent) {
          this.stockComponent.resetStock();
        }
        break;
      default:
        break;
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
