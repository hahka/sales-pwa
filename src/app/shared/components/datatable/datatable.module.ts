import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PageHeaderModule } from '../page-header/page-header.module';
import { SearchbarModule } from '../searchbar/searchbar.module';
import { DatatableComponent } from './datatable.component';
import { SortIndicatorComponent } from './sort-indicator/sort-indicator.component';

@NgModule({
  declarations: [DatatableComponent, SortIndicatorComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCheckboxModule,
    SearchbarModule,
    RouterModule,
    PageHeaderModule,
    TranslateModule,
  ],
  exports: [DatatableComponent],
})
export class DatatableModule {}
