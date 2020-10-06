import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SyncServiceMock } from 'tests/mocks/sync-service.mock';
import { SyncService } from '../../../features/sync/sync.service';
import { MarketsService } from './markets.service';

describe('MarketsService', () => {
  let service: MarketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SyncService,
          useClass: SyncServiceMock,
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MarketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
