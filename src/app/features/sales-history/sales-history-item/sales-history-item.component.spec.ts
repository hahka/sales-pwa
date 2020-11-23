import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHistoryItemComponent } from './sales-history-item.component';

describe('SalesHistoryItemComponent', () => {
  let component: SalesHistoryItemComponent;
  let fixture: ComponentFixture<SalesHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesHistoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
