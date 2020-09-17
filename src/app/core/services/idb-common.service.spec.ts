import { TestBed } from '@angular/core/testing';

import { IdbCommonService } from './idb-common.service';

describe('IdbCommonService', () => {
  let service: IdbCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdbCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
