import { TestBed } from '@angular/core/testing';

import { MarketSalesService } from './market-sales.service';

describe('MarketSalesService', () => {
  let service: MarketSalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketSalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
