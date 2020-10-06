import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { ProductsComponent } from './products.component';

const routes: Route[] = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: ':id',
    component: ProductsDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
