import { Shallow } from 'shallow-render';

import { DatatableModule } from '../datatable.module';
import { SortIndicatorComponent } from './sort-indicator.component';

describe('SortIndicatorComponent', () => {
  let shallow: Shallow<SortIndicatorComponent<any>>;

  beforeEach(() => {
    shallow = new Shallow(SortIndicatorComponent, DatatableModule);
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });
});
