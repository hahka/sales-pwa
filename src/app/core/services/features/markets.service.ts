import { Injectable } from '@angular/core';
import { Market } from 'src/app/shared/models/market.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class MarketsService extends ApiService<Market> {
  resource = 'markets';
}
