import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from 'src/app/core/services/features/products.service';
import { DetailComponent } from 'src/app/shared/components/detail/detail.component';
import { Product } from 'src/app/shared/models/product.model';
import { PRODUCT_CATEGORIES } from 'src/app/utils/enums';
import { POSTGRESQL_DUPLICATION_CODE } from 'src/app/utils/error_codes.util';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss'],
})
export class ProductsDetailComponent extends DetailComponent<Product> {
  PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;
  productCategories: string[] = Object.values(this.PRODUCT_CATEGORIES);

  fileData: File | undefined = undefined;
  previewUrl: any = null;

  /** Tells wether the image should be patched. */
  imageShouldBePatched: boolean;

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly productsService: ProductsService,
    private readonly formBuilder: FormBuilder,
    protected readonly location: Location,
    protected readonly router: Router,
    private readonly domSanitizer: DomSanitizer,
    private readonly translateService: TranslateService,
  ) {
    super(activatedRoute, productsService, location, router);
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      productOrder: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [null],
    });
  }

  newData(): Product {
    return new Product();
  }

  getFormattedData(): Product {
    const formValue = this.form.value;
    if (!this.imageShouldBePatched) {
      delete formValue.image;
    }

    return new Product(formValue);
  }

  patchForm(product: Product): void {
    this.imageShouldBePatched = false;
    this.form.patchValue(product);
    if (product.id) {
      this.productsService.getImage(product.id).subscribe((data: any) => {
        this.previewUrl = data
          ? this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${data}`)
          : null;
      });
    }
  }

  onHttpError(httpError: HttpErrorResponse): void {
    if (
      httpError.error &&
      httpError.error.code &&
      httpError.error.code === POSTGRESQL_DUPLICATION_CODE
    ) {
      if (this.form.controls.name) {
        this.form.controls.name.setErrors({ duplicated: true });
      }
    }
  }

  onFileInputChange(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    this.imageShouldBePatched = true;
    this.previewAndPatchValue();
  }

  /** Previews the image to upload and patches form's value. */
  previewAndPatchValue() {
    if (this.fileData) {
      // Show preview
      const mimeType = this.fileData.type;
      if (!mimeType.match(/image\/*/)) {
        return;
      }

      const reader = new FileReader();
      reader.readAsArrayBuffer(this.fileData);
      reader.onload = (_event) => {
        const result = reader.result;
        if (result) {
          const data = new Uint8Array(result as ArrayBuffer);
          const len = (result as ArrayBuffer).byteLength;
          let binary = '';
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(data[i]);
          }
          const base64 = window.btoa(binary);
          this.previewUrl = this.domSanitizer.bypassSecurityTrustUrl(
            `data:image/png;base64, ${base64}`,
          );
          this.form.patchValue({ image: base64 });

          return base64;
        }

        return;
      };
    }
  }

  translateCategoryName(category: PRODUCT_CATEGORIES) {
    return this.translateService.instant(`categories.product.${category}`);
  }
}
