import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, Input, IterableDiffer, IterableDiffers, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../core/services/features/products.service';
import { StockService } from '../../core/services/features/stock.service';
import { Product } from '../../shared/models/product.model';
import { StockItem } from '../../shared/models/stock-item.model';
import { Stock } from '../../shared/models/stock.model';
import { STOCK_CATEGORIES, STOCK_FUNCTIONALITIES } from '../../utils/enums';
import { CATEGORIES_MATCHING, STOCK_ORDER } from '../../utils/stocks.util';

export enum StockAction {
  SAVE = 'SAVE',
  RESET = 'RESET',
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, DoCheck {
  StockAction = StockAction;
  @Input() categories: STOCK_CATEGORIES[] = [];
  @Input() functionnality: STOCK_FUNCTIONALITIES = STOCK_FUNCTIONALITIES.PRODUCE;

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

  indexCorrection: { index: number; correction: number }[] = [];

  /** Width of the grid */
  responsiveCols = 3;

  sortedProducts: (StockItem & { name: string })[] = [];

  private categoriesDiff: IterableDiffer<STOCK_CATEGORIES>;

  private readonly tileSize = 350;

  constructor(
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
    private readonly domSanitizer: DomSanitizer,
    private readonly iterableDiffers: IterableDiffers,
    private readonly translateService: TranslateService,
    private readonly toasterService: ToastrService,
  ) {}

  /** Handle Resizing */
  onResize(event: any): void {
    this.responsiveCols = Math.trunc(event.target.innerWidth / this.tileSize);
    this.processCorrections();
  }

  ngOnInit(): void {
    this.responsiveCols = Math.trunc(window.innerWidth / this.tileSize);

    this.categoriesDiff = this.iterableDiffers.find(this.categories).create();

    this.productsService.getFull().subscribe((products) => {
      this.products = products || [];
      const stockFormArray = this.form.get('stock') as FormArray | null;

      if (stockFormArray) {
        products.forEach((product) => {
          if (product.image && product.id) {
            this.sanitizedImages[product.id] = this.domSanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${product.image}`,
            );
          }
        });

        this.stockService.getStock().subscribe((stock) => {
          this.stock = stock ? new Stock(stock) : new Stock();
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
      if (!this.stock) {
        this.stock = new Stock();
      }
      this.stock.stock = stockControl.value;
      this.stock.cleanItems();
      this.stockService.put(this.stock).subscribe((localStock) => {
        this.stock = localStock;
        stockControl.clear();
        this.initializeStock(true);
      });
    }
  }

  public resetStock(stock: STOCK_CATEGORIES) {
    const stockControl = this.form.get('stock') as FormArray | null;
    if (stockControl) {
      stockControl.controls.forEach((control) => {
        if (control.value.category === stock) {
          control.patchValue({ quantity: 0 });
        }
      });
    }
  }

  translateCategoryName(category: STOCK_CATEGORIES) {
    return this.translateService.instant(`categories.stock.${category}`);
  }

  processMissingDividers(index: number) {
    const correction = this.indexCorrection.find((data) => index === data.index);

    return correction ? correction.correction : 0;
  }

  increaseQuantity(i: number) {
    this.addToQuantityValue(i, 1);
  }

  decreaseQuantity(i: number) {
    this.addToQuantityValue(i, -1);
  }

  onClick(action: StockAction, stockCategory: STOCK_CATEGORIES) {
    switch (action) {
      case StockAction.RESET:
        if (
          this.functionnality === STOCK_FUNCTIONALITIES.PRODUCE ||
          this.functionnality === STOCK_FUNCTIONALITIES.MARKET_PREPARATION
        ) {
          this.resetStock(stockCategory);
        }
        break;
    }
  }

  private addToQuantityValue(i: number, quantity: number): void {
    const stockFormArray = this.form.get('stock') as FormArray | null;
    const quantityControl = stockFormArray && stockFormArray.at(i);
    if (quantityControl) {
      const value = quantityControl.value;
      if (this.functionnality === STOCK_FUNCTIONALITIES.MARKET_PREPARATION) {
        if (value.category === STOCK_CATEGORIES.SMALL_FREEZER) {
          const control = (stockFormArray as FormArray).controls.find(
            (fc) =>
              fc.value.productId === value.productId &&
              fc.value.category === STOCK_CATEGORIES.LARGE_FREEZER,
          );
          if (control) {
            const newValueForThisStock = value.quantity + quantity;
            const newValueForOtherStock = control.value.quantity - quantity;
            if (newValueForOtherStock >= 0 && newValueForThisStock >= 0) {
              quantityControl.patchValue({ quantity: newValueForThisStock });
              control.patchValue({ quantity: newValueForOtherStock });

              return;
            }
            if (newValueForOtherStock < 0) {
              this.toasterService.error(`Stock d'origin insuffisant`);
            }

            return;
          }
        }
      } else {
        const newValue = value.quantity + quantity;
        if (newValue >= 0) {
          quantityControl.patchValue({ quantity: value.quantity + quantity });

          return;
        }
      }
    } else {
      console.error('FormArray element missing');
    }
    console.error('some quantity is < 0');
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
          if (!!product.id) {
            const productId = product.id;
            CATEGORIES_MATCHING[product.category].forEach((category) => {
              dataBeforeSort.push({
                productId,
                name: product.name,
                category,
                quantity: 0,
              });
            });
          }
        });
        this.sortedProducts = dataBeforeSort.sort((a, b) => {
          return STOCK_ORDER[a.category] - STOCK_ORDER[b.category];
        });
        this.processCorrections();
        this.sortedProducts.forEach((data) => {
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

  /**
   * Processes where divs should beadded and what size they should have to have categories separated
   */
  private processCorrections(): void {
    let dataDisplayed = 0;
    this.indexOfDividers = [];
    this.indexCorrection = [];
    this.sortedProducts.forEach((data, index) => {
      if (this.categories.includes(data.category)) {
        if (
          index === 0 ||
          this.sortedProducts[index - 1].category !== this.sortedProducts[index].category
        ) {
          this.indexOfDividers.push(index);
          const push =
            (this.responsiveCols - (dataDisplayed % this.responsiveCols)) % this.responsiveCols;
          dataDisplayed += push;
          this.indexCorrection.push({ index, correction: push });
          dataDisplayed += 1;
        }
        dataDisplayed += 1;
      }
    });
  }
}
