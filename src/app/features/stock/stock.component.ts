import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductsService } from '../../core/services/features/products.service';
import { StockService } from '../../core/services/features/stock.service';
import { Product } from '../../shared/models/product.model';
import { Stock } from '../../shared/models/stock.model';
import { PRODUCT_CATEGORIES, STOCK_CATEGORIES } from '../../utils/enums';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  @Input() categories: STOCK_CATEGORIES[] = [STOCK_CATEGORIES.SMALL_FREEZER];

  quantities = Array.from(Array(51).keys());
  products: Product[];
  sanitizedImages: { [productId: string]: SafeResourceUrl } = {};

  stock: Stock;

  form = new FormGroup({
    stock: new FormArray([]),
  });

  constructor(
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
    private readonly domSanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.productsService.getFull().subscribe((products) => {
      const stockFormArray = this.form.get('stock') as FormArray | null;
      const dataBeforeSort: any[] = [];
      if (stockFormArray) {
        products.forEach((product) => {
          const PC = PRODUCT_CATEGORIES;
          const SC = STOCK_CATEGORIES;
          const pc = product.category;

          if (product.image) {
            this.sanitizedImages[product.id] = this.domSanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${product.image}`,
            );
          }
          const p = { id: product.id, name: product.name };
          if (
            (pc === PC.FRESH && this.categories.includes(SC.FRESH)) ||
            (pc === PC.PASTEURIZED && this.categories.includes(SC.PASTEURIZED))
          ) {
            const category = pc === PC.FRESH ? SC.FRESH : SC.PASTEURIZED;

            dataBeforeSort.push({
              ...p,
              category,
              quantity: 0,
            });
          } else if (pc === PC.FROZEN) {
            if (this.categories.includes(SC.SMALL_FREEZER)) {
              dataBeforeSort.push({
                ...p,
                category: SC.SMALL_FREEZER,
                quantity: 0,
              });
            }
            if (this.categories.includes(SC.LARGE_FREEZER)) {
              dataBeforeSort.push({
                ...p,
                category: SC.LARGE_FREEZER,
                quantity: 0,
              });
            }
          }
        });
        dataBeforeSort
          .sort((a, b) => {
            if (a.category === STOCK_CATEGORIES.FRESH) {
              return -1;
            }
            if (a.category === STOCK_CATEGORIES.SMALL_FREEZER) {
              return b.category === PRODUCT_CATEGORIES.FRESH ? 1 : -1;
            }
            if (a.category === STOCK_CATEGORIES.LARGE_FREEZER) {
              return b.category === PRODUCT_CATEGORIES.PASTEURIZED ? -1 : 1;
            }

            return 1;
          })
          .forEach((data) => {
            stockFormArray.push(
              new FormGroup({
                id: new FormControl(data.id),
                name: new FormControl(data.name),
                quantity: new FormControl(data.quantity),
                category: new FormControl(data.category),
              }),
            );
          });
        this.stockService.getStock().subscribe((stock: Stock) => {
          this.stock = stock;
          if (stock) {
            stock.stock.forEach((stockItem) => {
              if (this.categories.includes(stockItem.category)) {
                const control = stockFormArray.controls.find(
                  (fc) => fc.value.id === stockItem.productId,
                );
                if (control) {
                  control.patchValue({ quantity: stockItem.quantity });
                }
              }
            });
          }
        });
      } else {
        console.error('FormArray is missing');
      }
    });
  }

  onHttpError(_httpError: HttpErrorResponse): void {
    // if (
    //   httpError.error &&
    //   httpError.error.code &&
    //   httpError.error.code === POSTGRESQL_DUPLICATION_CODE
    // ) {
    //   if (this.form.controls.name) {
    //     this.form.controls.name.setErrors({ duplicated: true });
    //   }
    // }
  }

  putStock() {
    const stockControl = this.form.get('stock') as FormArray | null;
    console.log(stockControl);
    if (stockControl) {
      if (this.stock) {
        this.stock.stock.forEach((stock) => {
          if (this.categories.includes(stock.category) && stockControl) {
            console.log(stock);
          }
        });
      } else {
        this.stock =
          stockControl.value &&
          stockControl.value.map((data: any) => {
            return { productId: data.id, quantity: data.quantity, category: '' };
          });
      }
      this.stockService.put(this.stock);
    }
  }

  increaseQuantity(i: number) {
    this.addToQuantityValue(i, 1);
  }

  decreaseQuantity(i: number) {
    this.addToQuantityValue(i, -1);
  }

  private addToQuantityValue(i: number, quantity: number) {
    const stockFormArray = this.form.get('stock') as FormArray | null;
    const quantityControl = stockFormArray && stockFormArray.at(i);
    if (quantityControl) {
      const newValue = quantityControl.value.quantity + quantity;
      if (newValue >= 0) {
        quantityControl.patchValue({ quantity: quantityControl.value.quantity + quantity });
      }
    } else {
      console.error('FormArray element missing');
    }
  }
}
