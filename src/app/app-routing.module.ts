import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'markets',
    loadChildren: () => import('./features/markets/markets.module').then((m) => m.MarketsModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'producing',
    loadChildren: () =>
      import('./features/producing/producing.module').then((m) => m.ProducingModule),
  },
  {
    path: 'sync',
    loadChildren: () => import('./features/sync/sync.module').then((m) => m.SyncModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
