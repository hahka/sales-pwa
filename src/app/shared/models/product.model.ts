import { PRODUCT_CATEGORIES } from 'src/app/utils/enums';

export class Product {
  id: string;
  name: string;
  price: number;
  category: PRODUCT_CATEGORIES;
  stockQuantity: number;
}
