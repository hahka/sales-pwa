import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, Input, IterableDiffer, IterableDiffers, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../core/services/features/products.service';
import { StockService } from '../../core/services/features/stock.service';
import { Product } from '../../shared/models/product.model';
import { StockItem } from '../../shared/models/stock-item.model';
import { Stock } from '../../shared/models/stock.model';
import { STOCK_CATEGORIES } from '../../utils/enums';
import { CATEGORIES_MATCHING, STOCK_ORDER } from '../../utils/stocks.util';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, DoCheck {
  @Input() categories: STOCK_CATEGORIES[] = [];

  quantities = Array.from(Array(51).keys());
  products: Product[];
  sanitizedImages: { [productId: string]: SafeResourceUrl } = {};

  stock: Stock | undefined;

  form = new FormGroup({
    stock: new FormArray([]),
  });

  isStockInitialized = false;

  /** Used to know where categories of stock change between two items, to display the category */
  indexOfDividers: number[] = [];

  /** Width of the grid */
  gridCols = 3;

  private categoriesDiff: IterableDiffer<STOCK_CATEGORIES>;

  constructor(
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
    private readonly domSanitizer: DomSanitizer,
    private readonly iterableDiffers: IterableDiffers,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.categoriesDiff = this.iterableDiffers.find(this.categories).create();

    this.productsService.getFull().subscribe((products) => {
      this.products = products || [];
      const stockFormArray = this.form.get('stock') as FormArray | null;

      if (stockFormArray) {
        products.forEach((product) => {
          if (product.image) {
            this.sanitizedImages[product.id] = this.domSanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${product.image}`,
            );
          }
        });

        this.stockService.getStock().subscribe((stock) => {
          this.stock = stock || new Stock();
          this.initializeStock();
        });
      } else {
        console.error('FormArray is missing');
      }
    });
  }

  ngDoCheck() {
    const changes = this.categoriesDiff.diff(this.categories);
    this.initializeStock(!!changes || !this.isStockInitialized);
  }

  onHttpError(_httpError: HttpErrorResponse): void {}

  public updateStock() {
    const stockControl = this.form.get('stock') as FormArray | null;
    if (stockControl) {
      const newStock = new Stock();
      newStock.stock = stockControl.value;
      this.stockService.put(newStock).subscribe((stock) => {
        this.stock = stock;
        stockControl.clear();
        this.initializeStock(true);
      });
    }
  }

  public resetFreshStock() {
    const stockControl = this.form.get('stock') as FormArray | null;
    if (stockControl) {
      stockControl.controls.forEach((control) => {
        if (control.value.category === STOCK_CATEGORIES.FRESH) {
          control.patchValue({ quantity: 0 });
        }
      });
    }
  }

  translateCategoryName(category: STOCK_CATEGORIES) {
    return this.translateService.instant(`categories.stock.${category}`);
  }

  processMissingDividers(index: number) {
    return index % this.gridCols;
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

  private initializeStock(force?: boolean) {
    if (
      (!this.isStockInitialized || !!force) &&
      this.products &&
      this.products.length &&
      !!this.stock &&
      this.categories.length > 0
    ) {
      const stockFormArray = this.form.get('stock') as FormArray | null;
      const dataBeforeSort: (StockItem & { name: string })[] = [];
      if (stockFormArray) {
        this.products.forEach((product) => {
          CATEGORIES_MATCHING[product.category].forEach((category) => {
            dataBeforeSort.push({
              productId: product.id,
              name: product.name,
              category,
              quantity: 0,
            });
          });
        });
        const dataAfterSort = dataBeforeSort.sort((a, b) => {
          return STOCK_ORDER[a.category] - STOCK_ORDER[b.category];
        });
        dataAfterSort.forEach((data, index) => {
          if (this.categories.includes(data.category)) {
            if (
              index === 0 ||
              dataAfterSort[index - 1].category !== dataAfterSort[index].category
            ) {
              this.indexOfDividers.push(index);
            }
          }
          stockFormArray.push(
            new FormGroup({
              productId: new FormControl(data.productId),
              name: new FormControl(data.name),
              quantity: new FormControl(data.quantity),
              category: new FormControl(data.category),
            }),
          );
        });
        this.stock.stock.forEach((stockItem) => {
          const control = stockFormArray.controls.find(
            (fc) =>
              fc.value.productId === stockItem.productId &&
              fc.value.category === stockItem.category,
          );
          if (control) {
            control.patchValue({ quantity: stockItem.quantity });
          }
        });
        this.isStockInitialized = true;
      }
    }
  }
}
