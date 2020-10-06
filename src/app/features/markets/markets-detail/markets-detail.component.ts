import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketsService } from 'src/app/core/services/features/markets.service';
import { DetailComponent } from 'src/app/shared/components/detail/detail.component';
import { Market } from 'src/app/shared/models/market.model';
import { POSTGRESQL_DUPLICATION_CODE } from 'src/app/utils/error_codes.util';

@Component({
  selector: 'app-markets-detail',
  templateUrl: './markets-detail.component.html',
  styleUrls: ['./markets-detail.component.scss'],
})
export class MarketsDetailComponent extends DetailComponent<Market> {
  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly marketsService: MarketsService,
    private readonly formBuilder: FormBuilder,
    protected readonly location: Location,
    protected readonly router: Router,
  ) {
    super(activatedRoute, marketsService, location, router);
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
    });
  }
  newData(): Market {
    return new Market();
  }

  getFormattedData(): Market {
    return new Market(this.form.value);
  }

  patchForm(market: Market): void {
    this.form.patchValue(market);
  }

  onHttpError(httpError: HttpErrorResponse): void {
    if (
      httpError.error &&
      httpError.error.code &&
      httpError.error.code === POSTGRESQL_DUPLICATION_CODE
    ) {
      if (this.form.controls.name) {
        this.form.controls.name.setErrors({ duplicated: true });
      }
    }
  }
}
