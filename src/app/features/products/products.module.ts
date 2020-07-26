import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { DatatableModule } from 'src/app/shared/components/datatable/datatable.module';
import { DetailModule } from 'src/app/shared/components/detail/detail.module';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

@NgModule({
  declarations: [ProductsComponent, ProductsDetailComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    DatatableModule,
    TranslateModule,
    DetailModule,
    MatSelectModule,
  ],
})
export class ProductsModule {}
