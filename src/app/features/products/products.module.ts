import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DatatableModule } from 'src/app/shared/components/datatable/datatable.module';
import { DetailModule } from 'src/app/shared/components/detail/detail.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, ProductsRoutingModule, DatatableModule, TranslateModule, DetailModule],
})
export class ProductsModule {}
