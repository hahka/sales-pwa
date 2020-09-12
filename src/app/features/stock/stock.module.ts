import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ApiObsHelperModule } from '../../shared/components/api-obs-helper/api-obs-helper.module';
import { StockComponent } from './stock.component';

@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    ApiObsHelperModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [StockComponent],
})
export class StockModule {}
