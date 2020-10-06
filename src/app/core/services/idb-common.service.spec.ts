import { TestBed } from '@angular/core/testing';
import { Product } from 'src/app/shared/models/product.model';

import { IdbCommonService } from './idb-common.service';

describe('IdbCommonService', () => {
  let service: IdbCommonService<Product>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdbCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
