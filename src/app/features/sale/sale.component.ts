import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { computeTva, formatMarketSalesDate } from 'src/app/utils/utils';
import { MarketSalesService } from '../../core/services/features/market-sales.service';
import { MarketSalesComponent } from '../../shared/components/market-sales/market-sales.component';
import { MarketSales, Sale } from '../../shared/models/market-sales.model';
import { AppRoutes, STOCK_FUNCTIONALITIES } from '../../utils/enums';
import { StockAction, StockComponent } from '../stock/stock.component';
import { NotReadyDialogComponent } from './not-ready-dialog/not-ready-dialog.component';
import { SaleConfirmationDialogComponent } from './sale-confirmation-dialog/sale-confirmation-dialog.component';

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

  get tva() {
    return computeTva(this.currentPrice);
  }

  constructor(
    protected readonly marketSalesService: MarketSalesService,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
  ) {
    super(marketSalesService);
    this.marketSalesService.getCurrentMarketSales().subscribe((marketSales) => {
      this.marketSales = new MarketSales(marketSales);
    });
  }

  getSalesIncome() {
    const income = MarketSales.getSalesIncome(this.marketSales);

    return income > 0 ? ` (Montant des ventes: ${income}€)` : '';
  }

  getTitle() {
    return (this.marketSales && this.marketSales.marketName) || 'features.sale.title';
  }

  marketNotReadyHandler(): void {
    const dialogRef = this.matDialog.open(NotReadyDialogComponent);

    dialogRef.afterClosed().subscribe((_) => {
      this.router.navigate(['..', AppRoutes.MARKET_PREPARATION]);
    });
  }

  marketSalesDate() {
    return formatMarketSalesDate(this.marketSales);
  }

  onClick(action: StockAction) {
    switch (action) {
      case StockAction.SAVE:
        if (!this.marketSales) {
          this.marketSales = new MarketSales();
        }
        if (!this.marketSales.sales) {
          this.marketSales.sales = [];
        }
        if (this.stockComponent) {
          const sale = this.stockComponent.prepareSale();
          if (sale) {
            const dialogRef = this.matDialog.open(SaleConfirmationDialogComponent, {
              data: { sale },
            });

            dialogRef.afterClosed().subscribe((response) => {
              if (!!response.confirm) {
                if (!this.marketSales) {
                  this.marketSales = new MarketSales();
                }
                if (!this.marketSales.sales) {
                  this.marketSales.sales = [];
                }
                this.marketSales.sales.push({ ...sale, discount: response.discount });
                this.marketSalesService
                  .put(this.marketSales)
                  .subscribe((marketSales: MarketSales) => {
                    this.marketSales = marketSales;
                    if (this.stockComponent) {
                      this.stockComponent.updateStock();
                    } else {
                      console.error('Stock component cannot be reached');
                    }
                  });
              }
            });
          }
        } else {
          console.error('Stock component is missing');
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
