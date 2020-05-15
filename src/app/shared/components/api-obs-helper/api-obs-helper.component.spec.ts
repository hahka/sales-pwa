import { Shallow } from 'shallow-render';
import { ApiObsHelperComponent } from './api-obs-helper.component';
import { ApiObsHelperModule } from './api-obs-helper.module';

describe('ApiObsHelperComponent', () => {
  let shallow: Shallow<ApiObsHelperComponent<any>>;

  beforeEach(async () => {
    shallow = new Shallow(ApiObsHelperComponent, ApiObsHelperModule);
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });
});
