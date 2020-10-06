import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './utils/enums';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: AppRoutes.MARKETS_ADMIN,
    loadChildren: () => import('./features/markets/markets.module').then((m) => m.MarketsModule),
  },
  {
    path: AppRoutes.PRODUCTS_ADMIN,
    loadChildren: () => import('./features/products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: AppRoutes.PRODUCE,
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
    path: AppRoutes.SALE,
    loadChildren: () => import('./features/sale/sale.module').then((m) => m.SaleModule),
  },
  {
    path: AppRoutes.SYNC,
    loadChildren: () => import('./features/sync/sync.module').then((m) => m.SyncModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
