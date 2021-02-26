import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { MarketSalesService } from '../../core/services/features/market-sales.service';
import { MarketsService } from '../../core/services/features/markets.service';
import { ProductsService } from '../../core/services/features/products.service';
import { StockService } from '../../core/services/features/stock.service';
import { TypeHelper } from '../../utils/type-helper';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  isSynchronizationNeeded$: Observable<boolean>;

  private readonly isSynchronizationNeeded = new BehaviorSubject(false);

  private syncUpSub: Subscription;

  constructor(
    private readonly marketsService: MarketsService,
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
    private readonly marketSalesService: MarketSalesService,
    private readonly toastrService: ToastrService,
  ) {
    this.isSynchronizationNeeded$ = this.isSynchronizationNeeded.asObservable();
  }

  syncDown() {
    this.marketsService.synchronizeDown();
    this.productsService.synchronizeDown();
    this.stockService.synchronizeDown();
  }

  syncUp() {
    if (!this.syncUpSub || this.syncUpSub.closed) {
      this.syncUpSub = this.stockService
        .synchronizeUp()
        .pipe(
          filter(TypeHelper.isNotNullOrUndefined),
          switchMap(() => this.marketSalesService.synchronizeUp()),
          catchError((error) => {
            this.toastrService.error(`Erreur lors de l'envoi des données au serveur.`);

            return throwError(error);
          }),
          tap(() => this.toastrService.success(`Données envoyées au serveur avec succès`)),
        )
        .subscribe();
    }
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
