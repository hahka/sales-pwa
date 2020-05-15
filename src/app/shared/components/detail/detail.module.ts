import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiObsHelperModule } from '../api-obs-helper/api-obs-helper.module';
import { PageHeaderModule } from '../page-header/page-header.module';
import { DetailMockComponent } from './detail-mock/detail-mock.component';

@NgModule({
  imports: [
    CommonModule,
    ApiObsHelperModule,
    PageHeaderModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
  ],
  exports: [
    ApiObsHelperModule,
    PageHeaderModule,
    DetailMockComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
  ],
  declarations: [DetailMockComponent],
})
export class DetailModule {}
