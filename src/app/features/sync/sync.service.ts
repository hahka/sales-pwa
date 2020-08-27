import { Injectable } from '@angular/core';
import { MarketsService } from 'src/app/core/services/features/markets.service';
import { ProductsService } from 'src/app/core/services/features/products.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(
    private readonly marketsService: MarketsService,
    private readonly productsService: ProductsService,
  ) {}

  syncDown() {
    this.marketsService.synchronizeDown();
    this.productsService.synchronizeDown();
  }
}
