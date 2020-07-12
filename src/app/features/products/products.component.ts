import { Component } from '@angular/core';
import { ProductsService } from 'src/app/core/services/features/products.service';
import { AbstractListComponent } from 'src/app/shared/components/abstract-list/abstract-list.component';
import { ColumnType } from 'src/app/shared/components/datatable/column-type.enum';
import { FullColumn } from 'src/app/shared/components/datatable/full-column.model';
import { ApiDataSource } from 'src/app/shared/models/api/api-datasource.model';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends AbstractListComponent<Product> {
  dataSource: ApiDataSource<Product>;
  fullColumns: FullColumn<Product>[] = [
    {
      field: 'name',
      label: 'common.name',
      type: ColumnType.string,
    },
  ];

  listPersistenceKey: 'products';

  constructor(private readonly productsService: ProductsService) {
    super();
    this.dataSource = new ApiDataSource<Product>(
      (request, query) => {
        return this.productsService.search(request, query);
      },
      {
        initialQuery: { search: '' },
      },
    );
  }
}
