import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MarketSalesService } from 'src/app/core/services/features/market-sales.service';
import { DetailComponent } from 'src/app/shared/components/detail/detail.component';
import { MarketSales } from 'src/app/shared/models/market-sales.model';
import { ConfirmationDialogService } from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-sales-history-item',
  templateUrl: './sales-history-item.component.html',
  styleUrls: ['./sales-history-item.component.scss'],
})
export class SalesHistoryItemComponent extends DetailComponent<MarketSales> implements OnDestroy {
  displayCurrentSales = false;

  private confirmationSub: Subscription;

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly marketSalesService: MarketSalesService,
    protected readonly location: Location,
    protected readonly router: Router,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly formBuilder: FormBuilder,
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

    this.displayCurrentSales = this.activatedRoute.snapshot?.data?.displayCurrentSales;
    if (this.displayCurrentSales) {
      this.detail$ = this.refresh.asObservable().pipe(
        switchMap(() => {
          this.form.disable();

          // Consulting current sales =>
          return (this.marketSalesService.getCurrentMarketSales() as Observable<MarketSales>).pipe(
            tap((data) => {
              if (data) {
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

  patchForm(marketSales: MarketSales): void {
    this.form.patchValue(marketSales);
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
