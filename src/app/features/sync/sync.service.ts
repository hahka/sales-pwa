import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MarketsService } from '../../core/services/features/markets.service';
import { ProductsService } from '../../core/services/features/products.service';
import { StockService } from '../../core/services/features/stock.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  isSynchronizationNeeded$: Observable<boolean>;

  private readonly isSynchronizationNeeded = new BehaviorSubject(false);

  constructor(
    private readonly marketsService: MarketsService,
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
  ) {
    this.isSynchronizationNeeded$ = this.isSynchronizationNeeded.asObservable();
  }

  syncDown() {
    this.marketsService.synchronizeDown();
    this.productsService.synchronizeDown();
    this.stockService.synchronize();
  }

  checkIfSynchronizationIsNeeded() {
    if (navigator.onLine) {
      this.stockService.getStock().subscribe((stock) => {
        const should =
          !!stock &&
          (!stock.lastLocalUpdate ||
            new Date(stock.lastUpdate).getTime() - new Date(stock.lastLocalUpdate).getTime() !== 0);
        console.log('should sync', should);
        this.isSynchronizationNeeded.next(should);
      });
    } else {
      this.isSynchronizationNeeded.next(false);
    }
  }
}
