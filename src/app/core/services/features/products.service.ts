import { Injectable } from '@angular/core';
import { from, Subscription } from 'rxjs';
import { pluck, take } from 'rxjs/operators';
import { Product } from '../../../shared/models/product.model';
import { ApiService } from '../api/api.service';
import { StoresEnum } from '../idb.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService<Product> {
  resource = StoresEnum.PRODUCTS;
  offlineRights = {
    read: true,
    manage: false,
  };

  getImage(id: string) {
    if (navigator.onLine) {
      return this.httpClient.get(`${this.environmentService.apiUrl}${this.resource}/${id}/image`, {
        responseType: 'text',
      });
    }

    return from(this.idbService.getById(this.resource, id) as Promise<any>).pipe(
      take(1),
      pluck('image'),
    );
  }

  idbSearch(data: Product, keyword: string): boolean {
    return data.name.toUpperCase().indexOf(keyword.toUpperCase()) !== -1;
  }

  async synchronizeDown() {
    if (navigator.onLine) {
      await this.idbService.clearObjectStore(StoresEnum.MARKETS);
      let productsSub: Subscription;
      productsSub = this.httpClient
        .get<Product[]>(`${this.environmentService.apiUrl}${this.resource}/full`)
        .subscribe((products) => {
          if (productsSub && !productsSub.closed) {
            productsSub.unsubscribe();
          }
          products.forEach((product) => {
            const productForIdb = new Product(product);
            this.idbService.put(StoresEnum.PRODUCTS, productForIdb, product.id);
          });
        });
    } else {
      // TODO : error, offline
    }
  }
}
