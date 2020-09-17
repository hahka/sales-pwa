import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, Input, IterableDiffer, IterableDiffers, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
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

  get stockControl() {
    return this.form.get('stock') as FormArray | null;
  }

  private categoriesDiff: IterableDiffer<STOCK_CATEGORIES>;

  private readonly tileSize = 350;
  private readonly maxQuantity = 50;

  constructor(
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
    private readonly domSanitizer: DomSanitizer,
    private readonly iterableDiffers: IterableDiffers,
    private readonly translateService: TranslateService,
    private readonly toasterService: ToastrService,
  ) {}

  public quantities(index: number): number[] {
    const stockControl = this.stockControl;
    const productControl = stockControl && stockControl.at(index);

    const max = !!productControl && !!productControl.value && productControl.value.maxQuantity;

    return Array.from(Array((max || 0) + 1).keys());
  }

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

      if (this.stockControl) {
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
    const stockControl = this.stockControl;
    if (stockControl) {
      this.stock = new Stock(this.stock);
      this.stock.stock = stockControl.value;
      this.stock.cleanItems();
      this.stockService.put(this.stock).subscribe((localStock) => {
        this.stock = localStock;
        this.initializeStock(true);
      });
    }
  }

  public resetStock(stock: STOCK_CATEGORIES) {
    if (this.stockControl) {
      this.stockControl.controls.forEach((control) => {
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

  /** Increases quantity via user click */
  increaseQuantity(i: number) {
    this.addToQuantityValue(i, 1);
  }

  /** Decreases quantity via user click */
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
    const stockControl = this.stockControl;
    const productControl = stockControl && stockControl.at(i);
    if (productControl) {
      const value = productControl.value;
      if (this.functionnality === STOCK_FUNCTIONALITIES.MARKET_PREPARATION) {
        if (value.category === STOCK_CATEGORIES.SMALL_FREEZER) {
          const control = (stockControl as FormArray).controls.find(
            (fc) =>
              fc.value.productId === value.productId &&
              fc.value.category === STOCK_CATEGORIES.LARGE_FREEZER,
          );
          if (control) {
            const newValueForThisStock = value.quantity + quantity;
            const newValueForOtherStock = control.value.quantity - quantity;
            if (newValueForOtherStock >= 0 && newValueForThisStock >= 0) {
              productControl.patchValue({ quantity: newValueForThisStock });
              control.patchValue({ quantity: newValueForOtherStock });

              return;
            }
            if (newValueForOtherStock < 0) {
              this.toasterService.error(`Stock d'origin insuffisant`);
            }

            return;
          }
        } else {
          return this.patchQuantity(productControl, value.quantity + quantity);
        }
      } else {
        return this.patchQuantity(productControl, value.quantity + quantity);
      }
    } else {
      console.error('FormArray element missing');
    }
    console.error('some quantity is < 0');
  }

  private patchQuantity(quantityControl: AbstractControl, newQuantity: number) {
    if (newQuantity >= 0) {
      quantityControl.patchValue({ quantity: newQuantity });

      return;
    }
    console.error('new quantity is < 0');
  }

  private initializeStock(force?: boolean) {
    if (
      (!this.isStockInitialized || !!force) &&
      this.products &&
      this.products.length &&
      !!this.stock &&
      this.categories.length > 0
    ) {
      const stockControl = this.stockControl;
      const dataBeforeSort: (StockItem & { name: string })[] = [];
      if (stockControl) {
        if (force) {
          stockControl.clear();
        }
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
          stockControl.push(
            new FormGroup({
              productId: new FormControl(data.productId),
              name: new FormControl(data.name),
              quantity: new FormControl(data.quantity),
              maxQuantity: new FormControl(data.quantity),
              category: new FormControl(data.category),
            }),
          );
        });
        this.prepareStockQuantities(stockControl);
        this.prepareStockMaxQuantities(stockControl);

        this.isStockInitialized = true;
      }
    }
  }

  private prepareStockQuantities(stockControl: FormArray) {
    if (this.stock) {
      this.stock.stock.forEach((stockItem) => {
        const productControl = stockControl.controls.find(
          (fc) =>
            fc.value.productId === stockItem.productId && fc.value.category === stockItem.category,
        );
        if (productControl) {
          if (this.functionnality !== STOCK_FUNCTIONALITIES.MARKET) {
            productControl.patchValue({ quantity: stockItem.quantity });
          }
        }
      });
    }
  }

  private prepareStockMaxQuantities(stockControl: FormArray) {
    if (this.stock) {
      this.stock.stock.forEach((stockItem) => {
        const productControl = stockControl.controls.find(
          (fc) =>
            fc.value.productId === stockItem.productId && fc.value.category === stockItem.category,
        );
        if (productControl) {
          if (this.functionnality === STOCK_FUNCTIONALITIES.MARKET) {
            productControl.patchValue({ maxQuantity: stockItem.quantity });
          } else if (this.functionnality === STOCK_FUNCTIONALITIES.PRODUCE) {
            productControl.patchValue({ maxQuantity: this.maxQuantity });
          } else {
            // Market preparation. We can't put more products in SMALL_FREEZER than what is in LARGE_FREEZER

            const value = productControl.value;
            if (value.category === STOCK_CATEGORIES.SMALL_FREEZER) {
              const referenceControl = (stockControl as FormArray).controls.find(
                (fc) =>
                  fc.value.productId === value.productId &&
                  fc.value.category === STOCK_CATEGORIES.LARGE_FREEZER,
              );
              if (referenceControl) {
                const referenceValue = referenceControl.value.quantity;
                if (referenceValue) {
                  productControl.patchValue({ maxQuantity: referenceValue });

                  return;
                }

                return;
              }
            } else {
              productControl.patchValue({ maxQuantity: this.maxQuantity });
            }
          }
        }
      });
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
