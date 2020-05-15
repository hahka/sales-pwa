import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MarketsDetailComponent } from './markets-detail/markets-detail.component';
import { MarketsComponent } from './markets.component';

const routes: Route[] = [
  {
    path: '',
    component: MarketsComponent,
  },
  {
    path: ':id',
    component: MarketsDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketsRoutingModule {}
