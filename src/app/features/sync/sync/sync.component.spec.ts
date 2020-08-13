import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Shallow } from 'shallow-render';
import { SyncModule } from '../sync.module';
import { SyncComponent } from './sync.component';

describe('SyncComponent', () => {
  let shallow: Shallow<SyncComponent>;

  beforeEach(() => {
    shallow = new Shallow(SyncComponent, SyncModule).import(HttpClientTestingModule);
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });
});
