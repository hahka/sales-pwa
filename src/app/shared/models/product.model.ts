import { PRODUCT_CATEGORIES } from 'src/app/utils/enums';
import { BaseModel } from './api/base.model';

export class Product implements BaseModel {
  id?: string;
  name: string;
  price: number;
  category: PRODUCT_CATEGORIES;
  image?: string;
  productOrder: number;

  constructor(obj?: Product) {
    Object.assign(this, obj);
  }

  prepareForIdb() {
    return {
      ...this,
      nameSortable: this.name.toUpperCase(),
      productOrderSortable: this.productOrder,
    };
  }
}

export class SavedProduct extends Product {
  id: string;
}
