import { Shallow } from 'shallow-render';

import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApiDataSource } from '../../models/api/api-datasource.model';
import { DatatableComponent } from './datatable.component';
import { DatatableModule } from './datatable.module';

describe('DatatableComponent', () => {
  let shallow: Shallow<DatatableComponent>;

  beforeEach(() => {
    shallow = new Shallow(DatatableComponent, DatatableModule)
      .provide(ActivatedRoute)
      .provide(Router)
      .provide(ApiDataSource)
      .mock(ApiDataSource, {
        sortBy: () => {},
      });
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });

  it('should set displayedColumns via fullColumns', async () => {
    const { instance } = await shallow.render();
    expect(instance.displayedColumns).toEqual([]);
    instance.fullColumns = [];
    expect(instance.displayedColumns).toEqual([]);
    instance.fullColumns = [
      { field: 'fakeField1', label: 'fakeLabel1' },
      { field: 'fakeField2', label: 'fakeLabel2' },
    ];
    expect(instance.displayedColumns).toEqual(['fakeField1', 'fakeField2']);
  });

  it('should add select to displayedColumns when selectable', async () => {
    const { instance } = await shallow.render();
    expect(instance.displayedColumns).toEqual([]);
    instance.fullColumns = [];
    expect(instance.displayedColumns).toEqual([]);
    instance.fullColumns = [
      { field: 'fakeField1', label: 'fakeLabel1' },
      { field: 'fakeField2', label: 'fakeLabel2' },
    ];
    expect(instance.displayedColumns).toEqual(['fakeField1', 'fakeField2']);
    instance.selectable = true;
    expect(instance.displayedColumns).toEqual(['select', 'fakeField1', 'fakeField2']);
  });

  it('should handle onSortChange', async () => {
    const { instance } = await shallow.render();
    instance.dataSource = new ApiDataSource(() => of(), { initialQuery: { search: '' } });
    const sortBySpy = spyOn(instance.dataSource, 'sortBy');
    expect(sortBySpy).not.toHaveBeenCalled();
    instance.onSortChange('fakeField1', '');
    expect(sortBySpy).toHaveBeenCalledWith(undefined);
    instance.onSortChange('fakeField2', 'asc');
    expect(sortBySpy).toHaveBeenCalledWith({
      field: 'fakeField2',
      order: 1,
    });
    instance.onSortChange('fakeField3', 'desc');
    expect(sortBySpy).toHaveBeenCalledWith({
      field: 'fakeField3',
      order: -1,
    });
  });
});
