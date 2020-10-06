import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SyncComponent } from './sync/sync.component';

const routes: Route[] = [
  {
    path: '',
    component: SyncComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncRoutingModule {}
