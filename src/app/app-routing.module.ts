import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './utils/enums';

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
    path: 'produce',
    loadChildren: () => import('./features/produce/produce.module').then((m) => m.ProduceModule),
  },
  {
    path: AppRoutes.MARKET_PREPARATION,
    loadChildren: () =>
      import('./features/market-preparation/market-preparation.module').then(
        (m) => m.MarketPreparationModule,
      ),
  },
  {
    path: 'sale',
    loadChildren: () => import('./features/sale/sale.module').then((m) => m.SaleModule),
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
