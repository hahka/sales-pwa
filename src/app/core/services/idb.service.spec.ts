import { TestBed } from '@angular/core/testing';
import { Product } from '../../shared/models/product.model';

import { IdbService } from './idb.service';

describe('IdbService', () => {
  let service: IdbService<Product>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
