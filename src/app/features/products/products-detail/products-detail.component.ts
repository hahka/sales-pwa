import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
  fileUploadProgress: string | undefined = undefined;
  uploadedFilePath: string | undefined = undefined;

  imageToUpload: any;

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly productsService: ProductsService,
    private readonly formBuilder: FormBuilder,
    protected readonly location: Location,
    protected readonly router: Router,
    private readonly domSanitizer: DomSanitizer,
  ) {
    super(activatedRoute, productsService, location, router);
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [null],
    });
  }

  newData(): Product {
    return new Product();
  }

  getFormattedData(): Product {
    return this.form.value;
  }

  patchForm(product: Product): void {
    this.form.patchValue(product);
    this.productsService.getImage(product.id).subscribe((data: any) => {
      this.previewUrl = data
        ? this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${data}`)
        : null;
    });
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

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    this.preview();
  }

  preview() {
    if (this.fileData) {
      // Show preview
      const mimeType = this.fileData.type;
      if (!mimeType.match(/image\/*/)) {
        return;
      }

      const reader = new FileReader();
      // reader.readAsDataURL(this.fileData);
      reader.readAsArrayBuffer(this.fileData);
      reader.onload = (_event) => {
        const result = reader.result;
        if (result) {
          // this.previewUrl = result;
          const data = new Uint8Array(result as ArrayBuffer);
          const len = (result as ArrayBuffer).byteLength;
          let binary = '';
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(data[i]);
          }
          const base64 = window.btoa(binary);
          // this.imageToUpload = base64;
          this.previewUrl = this.domSanitizer.bypassSecurityTrustUrl(
            `data:image/png;base64, ${base64}`,
          );
          console.log(this.previewUrl);
          this.form.patchValue({ image: base64 });

          return base64;
        }

        return;
      };
    }
  }
}
