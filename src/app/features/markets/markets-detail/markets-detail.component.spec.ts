import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Shallow } from 'shallow-render';

import { MockOfActivatedRoute } from 'tests/mocks/activated-route.mock';
import { ApiServiceMock } from 'tests/mocks/api-service.mock';
import { MarketsService } from '../../../core/services/features/markets.service';
import { MarketsModule } from '../markets.module';
import { MarketsDetailComponent } from './markets-detail.component';

describe('MarketsDetailComponent', () => {
  let shallow: Shallow<MarketsDetailComponent>;

  beforeEach(() => {
    shallow = new Shallow(MarketsDetailComponent, MarketsModule)
      .import(RouterTestingModule)
      .provide([{ provide: MarketsService, useClass: ApiServiceMock }])
      .mock(ActivatedRoute, new MockOfActivatedRoute());
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });
});
