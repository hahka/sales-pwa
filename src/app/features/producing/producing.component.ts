import { Component } from '@angular/core';
import { STOCK_CATEGORIES as SC } from 'src/app/utils/enums';

@Component({
  selector: 'app-producing',
  templateUrl: './producing.component.html',
  styleUrls: ['./producing.component.scss'],
})
export class ProducingComponent {
  categories: SC[] = [SC.FRESH, SC.LARGE_FREEZER, SC.PASTEURIZED];
}
