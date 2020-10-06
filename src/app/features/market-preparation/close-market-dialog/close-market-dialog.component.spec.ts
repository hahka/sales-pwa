import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseMarketDialogComponent } from './close-market-dialog.component';

describe('CloseMarketDialogComponent', () => {
  let component: CloseMarketDialogComponent;
  let fixture: ComponentFixture<CloseMarketDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseMarketDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseMarketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
