import { DatePipe, Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MarketSalesService } from 'src/app/core/services/features/market-sales.service';
import { DetailComponent } from 'src/app/shared/components/detail/detail.component';
import { MarketSales, Sale } from 'src/app/shared/models/market-sales.model';
import { StockService } from '../../../core/services/features/stock.service';
import { ConfirmationDialogService } from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-sales-history-item',
  templateUrl: './sales-history-item.component.html',
  styleUrls: ['./sales-history-item.component.scss'],
})
export class SalesHistoryItemComponent extends DetailComponent<MarketSales> implements OnDestroy {
  displayCurrentSales = false;

  marketSales: MarketSales;

  private confirmationSub: Subscription;

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly marketSalesService: MarketSalesService,
    protected readonly location: Location,
    protected readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly formBuilder: FormBuilder,
    private readonly stockService: StockService,
  ) {
    super(activatedRoute, marketSalesService, location, router);
    this.form = this.formBuilder.group({
      id: [''],
      name: [''],
      startDate: [''],
      endDate: [''],
      income: [''],
      sales: [''],
    });

    this.displayCurrentSales = !!this.activatedRoute.snapshot?.data?.displayCurrentSales;
    if (this.displayCurrentSales) {
      this.detail$ = this.refresh.asObservable().pipe(
        switchMap(() => {
          this.form.disable();

          // Consulting current sales =>
          return (this.marketSalesService.getCurrentMarketSales() as Observable<MarketSales>).pipe(
            tap((data) => {
              console.log(data);
              // const income = MarketSales.getSalesIncome(this.marketSales);
              if (data) {
                this.marketSales = data;
                data.income = MarketSales.getSalesIncome(data);
                this.patchForm(data);
                this.disable();
              }
            }),
          );
        }),
      );
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.confirmationSub) {
      this.confirmationSub.unsubscribe();
    }
  }

  newData(): MarketSales {
    return new MarketSales();
  }

  getFormattedData(): MarketSales {
    return new MarketSales(this.form.value);
  }

  getSaleIncome(sale: Sale) {
    return (
      (sale?.items || []).map((item) => item.price).reduce((acc, val) => acc + val) -
      (sale.discount || 0)
    );
  }

  patchForm(marketSales: MarketSales): void {
    this.form.patchValue(marketSales);
  }

  cancelSale(sale: Sale) {
    if (!this.displayCurrentSales) {
      return;
    }
    if (this.confirmationSub) {
      this.confirmationSub.unsubscribe();
    }
    this.confirmationSub = this.confirmationDialogService
      .openConfirmationDialog(
        'Annuler une vente',
        'Voulez-vous vraiment annuler cette vente ' +
          (this.getSaleIncome(sale) ? `de ${this.getSaleIncome(sale)}€ ` : '') +
          `faite à ${new DatePipe('fr-FR').transform(sale.date, 'HH:mm')}`,
      )
      .pipe(
        switchMap(() => {
          this.stockService.cancelSale(sale).subscribe();
          const marketSales = this.marketSales;
          marketSales.sales = marketSales.sales?.filter(
            (marketSale) => marketSale.date !== sale.date,
          );
          marketSales.income = MarketSales.getSalesIncome(marketSales);

          return this.marketSalesService.put(marketSales);
        }),
        tap(() => this.refresh.next(this.detailId)),
      )
      .subscribe();
  }

  delete() {
    if (this.confirmationSub) {
      this.confirmationSub.unsubscribe();
    }
    this.confirmationSub = this.confirmationDialogService
      .openConfirmationDialog(
        "Supprimer un élément de l'historique",
        "Voulez-vous vraiment supprimer définitivement cet élément de l'historique?",
      )
      .pipe(tap(() => super.delete()))
      .subscribe();
  }
}
