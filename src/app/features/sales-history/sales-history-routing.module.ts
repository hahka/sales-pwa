import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SalesHistoryItemComponent } from './sales-history-item/sales-history-item.component';
import { SalesHistoryComponent } from './sales-history.component';

const routes: Route[] = [
  {
    path: '',
    component: SalesHistoryComponent,
  },
  {
    path: ':id',
    component: SalesHistoryItemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesHistoryRoutingModule {}
