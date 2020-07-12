import { Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService<Product> {
  resource = 'products';
}
