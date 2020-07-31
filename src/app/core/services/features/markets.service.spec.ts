import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MarketsService } from './markets.service';

describe('MarketsService', () => {
  let service: MarketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(MarketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
