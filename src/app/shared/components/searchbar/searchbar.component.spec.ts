import { Shallow } from 'shallow-render';

import { SearchbarComponent } from './searchbar.component';
import { SearchbarModule } from './searchbar.module';

describe('SearchbarComponent', () => {
  let shallow: Shallow<SearchbarComponent>;

  beforeEach(() => {
    shallow = new Shallow(SearchbarComponent, SearchbarModule);
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });
});
