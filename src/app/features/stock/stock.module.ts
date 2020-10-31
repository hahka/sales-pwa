import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { ApiObsHelperModule } from '../../shared/components/api-obs-helper/api-obs-helper.module';
import { ResetStockDialogModule } from './reset-stock-dialog/reset-stock-dialog.module';
import { StockComponent } from './stock.component';

@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    ApiObsHelperModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastrModule,
    ResetStockDialogModule,
  ],
  exports: [StockComponent],
})
export class StockModule {}
