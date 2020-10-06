import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Shallow } from 'shallow-render';

import { MockOfActivatedRoute } from 'tests/mocks/activated-route.mock';
import { ApiServiceMock } from 'tests/mocks/api-service.mock';
import { ProductsService } from '../../../core/services/features/products.service';
import { ProductsModule } from '../products.module';
import { ProductsDetailComponent } from './products-detail.component';

describe('ProductsDetailComponent', () => {
  let shallow: Shallow<ProductsDetailComponent>;

  beforeEach(() => {
    shallow = new Shallow(ProductsDetailComponent, ProductsModule)
      .import(RouterTestingModule)
      .provide([{ provide: ProductsService, useClass: ApiServiceMock }])
      .mock(ActivatedRoute, new MockOfActivatedRoute());
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeTruthy();
  });
});
