import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearObjectStoresWarningDialogComponent } from './clear-object-stores-warning-dialog.component';

describe('ClearObjectStoresWarningDialogComponent', () => {
  let component: ClearObjectStoresWarningDialogComponent;
  let fixture: ComponentFixture<ClearObjectStoresWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearObjectStoresWarningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearObjectStoresWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
