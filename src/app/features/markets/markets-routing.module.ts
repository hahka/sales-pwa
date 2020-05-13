import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MarketsComponent } from './markets.component';

const routes: Route[] = [
  {
    path: '',
    component: MarketsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketsRoutingModule {}
