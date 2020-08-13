import { Injectable } from '@angular/core';
import { MarketsService } from 'src/app/core/services/features/markets.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(private readonly marketsService: MarketsService) {}

  syncDown() {
    this.marketsService.synchronizeDown();
  }
}
