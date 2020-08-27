import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SyncServiceMock } from 'tests/mocks/sync-service.mock';
import { SyncService } from '../../../features/sync/sync.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

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
    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
