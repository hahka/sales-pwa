import { Shallow } from 'shallow-render';

import { ApiServiceMock } from 'tests/mocks/api-service.mock';
import { ProductsService } from '../../core/services/features/products.service';
import { ProductsComponent } from './products.component';
import { ProductsModule } from './products.module';

describe('ProductsComponent', () => {
  let shallow: Shallow<ProductsComponent>;

  beforeEach(() => {
    shallow = new Shallow(ProductsComponent, ProductsModule).provide([
      { provide: ProductsService, useClass: ApiServiceMock },
    ]);
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });
});
