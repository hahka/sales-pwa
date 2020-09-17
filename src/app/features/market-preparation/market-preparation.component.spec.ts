import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPreparationComponent } from './market-preparation.component';

describe('MarketPreparationComponent', () => {
  let component: MarketPreparationComponent;
  let fixture: ComponentFixture<MarketPreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPreparationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
