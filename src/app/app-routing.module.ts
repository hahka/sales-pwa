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
    path: 'stock',
    loadChildren: () => import('./features/stock/stock.module').then((m) => m.StockModule),
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
