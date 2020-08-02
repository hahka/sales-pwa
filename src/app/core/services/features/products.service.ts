import { Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { ApiService } from '../api/api.service';
import { StoresEnum } from '../idb.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService<Product> {
  resource = StoresEnum.PRODUCTS;

  getImage(id: string) {
    return this.httpClient.get(`${this.environmentService.apiUrl}${this.resource}/${id}/image`, {
      responseType: 'text',
    });
  }
}
