import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketSalesService } from 'src/app/core/services/features/market-sales.service';
import { DetailComponent } from 'src/app/shared/components/detail/detail.component';
import { MarketSales } from 'src/app/shared/models/market-sales.model';

@Component({
  selector: 'app-sales-history-item',
  templateUrl: './sales-history-item.component.html',
  styleUrls: ['./sales-history-item.component.scss'],
})
export class SalesHistoryItemComponent extends DetailComponent<MarketSales> {
  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly marketSalesService: MarketSalesService,
    private readonly formBuilder: FormBuilder,
    protected readonly location: Location,
    protected readonly router: Router,
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
}
