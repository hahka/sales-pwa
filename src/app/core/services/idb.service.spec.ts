import { TestBed } from '@angular/core/testing';

import { BaseModel } from '../../shared/models/api/base.model';
import { IdbService } from './idb.service';

export class Fake implements BaseModel {
  id: string;
  prepareForIdb() {}
}

describe('IdbService', () => {
  let service: IdbService<Fake>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
