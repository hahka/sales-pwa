import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleConfirmationDialogComponent } from './sale-confirmation-dialog.component';

describe('SaleConfirmationDialogComponent', () => {
  let component: SaleConfirmationDialogComponent;
  let fixture: ComponentFixture<SaleConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
