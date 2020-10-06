import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetStockDialogComponent } from './reset-stock-dialog.component';

describe('ResetStockDialogComponent', () => {
  let component: ResetStockDialogComponent;
  let fixture: ComponentFixture<ResetStockDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetStockDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetStockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
