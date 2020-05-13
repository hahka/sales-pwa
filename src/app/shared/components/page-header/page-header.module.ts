import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PageHeaderComponent } from './page-header.component';

@NgModule({
  imports: [MatIconModule, MatButtonModule, CommonModule],
  exports: [PageHeaderComponent],
  declarations: [PageHeaderComponent],
})
export class PageHeaderModule {}
