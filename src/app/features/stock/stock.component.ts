import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { pairwise, startWith } from 'rxjs/operators';
import { ProductsService } from '../../core/services/features/products.service';
import { StockService } from '../../core/services/features/stock.service';
import { Sale, SaleItem } from '../../shared/models/market-sales.model';
import { Product } from '../../shared/models/product.model';
import { StockItem } from '../../shared/models/stock-item.model';
import { Stock } from '../../shared/models/stock.model';
import { STOCK_CATEGORIES, STOCK_FUNCTIONALITIES } from '../../utils/enums';
import { CATEGORIES_MATCHING, STOCK_ORDER } from '../../utils/stocks.util';
import { ResetStockDialogComponent } from './reset-stock-dialog/reset-stock-dialog.component';

export enum StockAction {
  SAVE = 'SAVE',
  RESET = 'RESET',
  RESET_ALL = 'RESET_ALL',
}

export class StockItemForForm extends StockItem {
  name: string;
  price: number;
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

  @Output() saleUpdate: EventEmitter<Sale> = new EventEmitter();

  products: Product[];
  sanitizedImages: { [productId: string]: SafeResourceUrl } = {};

  /** The stock fetched from server. This is manually updated only when selling items */
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

  sortedProducts: StockItemForForm[] = [];

  get stockControl() {
    return this.form.get('stock') as FormArray | null;
  }

  private categoriesDiff: IterableDiffer<STOCK_CATEGORIES>;

  private readonly tileSize = 350;
  private readonly maxQuantity = 100;

  constructor(
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
    private readonly domSanitizer: DomSanitizer,
    private readonly iterableDiffers: IterableDiffers,
    private readonly translateService: TranslateService,
    private readonly toasterService: ToastrService,
    private readonly matDialog: MatDialog,
  ) {
    this.form.valueChanges.subscribe(() => {
      this.emitSale();
    });
  }

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

  /**
   * Updates the stock after either the stock has been updated manually or after a sale.
   */
  public updateStock() {
    const stockControl = this.stockControl;
    if (stockControl) {
      this.stock = new Stock(this.stock);

      this.stock.stock = this.prepareStockAfterSale(stockControl.value);
      this.stock.cleanItems();
      this.stockService.put(this.stock).subscribe((_) => {
        this.initializeStock(true);
      });
    }
  }

  public resetStock(stock?: STOCK_CATEGORIES) {
    if (this.functionnality !== STOCK_FUNCTIONALITIES.MARKET) {
      const dialogRef = this.matDialog.open(ResetStockDialogComponent, {
        data: {
          stock,
          forSale: false,
        },
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.confirmResetStock(stock);
        }
      });
    } else {
      this.confirmResetStock(stock);
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

  /**
   * Prepares a sale that can be used by SaleComponent
   */
  prepareSale() {
    const stockControl = this.stockControl;
    if (stockControl) {
      const filteredItems = Stock.staticCleanItems(stockControl.value).filter(
        (stockItem) => stockItem.quantity,
      );
      if (filteredItems) {
        return new Sale({
          items: this.prepareStockItemsForSale(filteredItems),
          date: new Date().toISOString(),
          discount: 0,
        });
      }
    }

    return null;
  }

  /** Patches the quantity value if it is >= 0 or <= maxQuantity */
  private addToQuantityValue(i: number, quantity: number): void {
    const stockControl = this.stockControl;
    const productControl = stockControl && stockControl.at(i);
    if (productControl) {
      const value = productControl.value;
      const newValueForThisStock = value.quantity + quantity;
      if (newValueForThisStock > value.maxQuantity) {
        if (this.functionnality === STOCK_FUNCTIONALITIES.MARKET_PREPARATION) {
          if (value.category === STOCK_CATEGORIES.SMALL_FREEZER) {
            this.toasterService.error(`Stock d'origin insuffisant`);
          }
        }

        return;
      }

      return this.patchQuantity(productControl, newValueForThisStock);
    }
    console.error('FormArray element missing');
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
      this.isStockInitialized = false;
      const stockControl = this.stockControl;
      const dataBeforeSort: StockItemForForm[] = [];
      if (stockControl) {
        if (force) {
          stockControl.clear();
        }
        this.products.forEach((product) => {
          if (!!product.id) {
            const { id, name, price } = product;
            CATEGORIES_MATCHING[product.category].forEach((category) => {
              dataBeforeSort.push({
                productId: id,
                name,
                price,
                category,
                quantity: 0,
              });
            });
          }
        });
        this.sortedProducts = dataBeforeSort.sort((a, b) => {
          return STOCK_ORDER[a.category] - STOCK_ORDER[b.category];
        });
        const stockPreparation = this.prepareStockQuantities(this.sortedProducts);

        this.processCorrections();
        stockPreparation.forEach((data) => {
          const productFormGroup = new FormGroup({
            productId: new FormControl(data.productId),
            name: new FormControl(data.name),
            price: new FormControl(data.price),
            quantity: new FormControl(data.quantity),
            maxQuantity: new FormControl(data.quantity),
            category: new FormControl(data.category),
          });
          stockControl.push(productFormGroup);
          productFormGroup.valueChanges
            .pipe(startWith(productFormGroup.value), pairwise())
            .subscribe(([oldValue, newValue]) => {
              this.updateLinkedStock(oldValue, newValue);
            });
        });

        this.patchStockMaxQuantities(stockControl);

        this.isStockInitialized = true;
      }
    }
  }

  private confirmResetStock(stock?: STOCK_CATEGORIES) {
    if (this.stockControl) {
      this.stockControl.controls.forEach((control) => {
        if (!stock || control.value.category === stock) {
          control.patchValue({ quantity: 0 });
        }
      });
    }
  }

  private prepareStockQuantities(products: StockItemForForm[]) {
    if (this.stock) {
      this.stock.stock.forEach((stockItem) => {
        const productIndex = products.findIndex(
          (fc) => fc.productId === stockItem.productId && fc.category === stockItem.category,
        );
        if (productIndex !== -1) {
          if (this.functionnality !== STOCK_FUNCTIONALITIES.MARKET) {
            products[productIndex].quantity = stockItem.quantity;
          }
        }
      });
    }

    return products;
  }

  private patchStockMaxQuantities(stockControl: FormArray) {
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
                  productControl.patchValue({ maxQuantity: referenceValue + value.quantity });

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

  /**
   * Prepares the stock after a sale has been made.
   * Should have effect only in MARKET mode and if a sale is being made.
   * Should reset the sale after the stock has been prepared
   * @param stock Value of the FormArray which contains the items of the sale
   */
  private prepareStockAfterSale(stock: StockItem[]): StockItem[] {
    const sale = this.prepareSale();
    if (this.functionnality !== STOCK_FUNCTIONALITIES.MARKET || !sale) {
      return stock;
    }

    if (this.stock) {
      // After a sale. We need to substract stock quantities to this.stock quantities.
      stock.forEach((stockItem) => {
        if (this.stock) {
          const index = this.stock.stock.findIndex((sstockItem) => {
            return (
              sstockItem.productId === stockItem.productId &&
              sstockItem.category === stockItem.category
            );
          });
          this.stock.stock[index].quantity -= stockItem.quantity;
        }
      });

      return this.stock.stock;
    }

    return stock;
  }
  /**
   * Transforms stock items to sale items so they can be used by Sale model
   * @param items Items being sold
   */
  private prepareStockItemsForSale(items: StockItem[]): SaleItem[] {
    return items
      .map((item) => {
        const product = this.products.find((p) => p.id === item.productId);
        if (product) {
          return new SaleItem({
            product: { id: item.productId, name: product.name },
            quantity: item.quantity,
            price: product.price * item.quantity,
          });
        }

        return undefined;
      })
      .filter((si) => !!si) as SaleItem[];
  }

  /**
   * Called whenever form values change.
   */
  private emitSale() {
    const stock = this.stockControl;
    if (stock) {
      const filteredItems = Stock.staticCleanItems(stock.value).filter(
        (stockItem) => stockItem.quantity,
      );
      this.saleUpdate.emit(
        new Sale({
          items: this.prepareStockItemsForSale(filteredItems),
          date: new Date().toISOString(),
          discount: 0,
        }),
      );
    }
  }

  /**
   * Updates stock that are linked when a change is made on a d product.
   * e.g. when a product from SMALL_FREEZER changes in quantity, the same product in LARGE_FREEZER should change accordingly in quantity.
   * +quantity in S_FREEZER => -quantity in L_FREEZER
   * @param oldControlValue Ancient value of the product FormGroup
   * @param newControlValue New value of the product FormGroup
   */
  private updateLinkedStock(oldControlValue: any, newControlValue: any) {
    if (this.functionnality === STOCK_FUNCTIONALITIES.MARKET_PREPARATION) {
      if (this.isStockInitialized && this.stockControl) {
        const stockCategory = newControlValue.category;
        if (stockCategory === STOCK_CATEGORIES.SMALL_FREEZER) {
          const oldQuantity = oldControlValue.quantity;
          const newQuantity = newControlValue.quantity;

          /** Diff should be added from linked stock */
          const diff = (oldQuantity || 0) - (newQuantity || 0);
          if (diff !== 0) {
            const productId = newControlValue.productId;
            const linkedControl = this.stockControl.controls.find(
              (fc) =>
                fc.value.productId === productId &&
                fc.value.category === STOCK_CATEGORIES.LARGE_FREEZER,
            );
            if (linkedControl) {
              linkedControl.patchValue({ quantity: linkedControl.value.quantity + diff });
            }
          }
        }
      }
    }
  }
}
