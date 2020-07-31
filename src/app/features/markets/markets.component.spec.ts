import { Shallow } from 'shallow-render';

import { ApiServiceMock } from 'tests/mocks/api-service.mock';
import { MarketsService } from '../../core/services/features/markets.service';
import { MarketsComponent } from './markets.component';
import { MarketsModule } from './markets.module';

describe('MarketsComponent', () => {
  let shallow: Shallow<MarketsComponent>;

  beforeEach(() => {
    shallow = new Shallow(MarketsComponent, MarketsModule).provide([
      { provide: MarketsService, useClass: ApiServiceMock },
    ]);
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });
});
