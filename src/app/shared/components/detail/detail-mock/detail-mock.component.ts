import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api/api.service';
import { DetailComponent } from '../detail.component';

@Component({
  selector: 'app-detail-mock',
  template: '',
})
export class DetailMockComponent extends DetailComponent<any> {
  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly apiService: ApiService<any>,
    protected readonly location: Location,
    protected readonly router: Router,
  ) {
    super(activatedRoute, apiService, location, router);
    this.form = new FormGroup({ id: new FormControl('', Validators.required) });
  }

  newData(): any {
    return {};
  }
  getFormattedData(): any {
    return this.form.value;
  }
  patchForm(data: any): void {
    this.form.patchValue(data);
  }
}
