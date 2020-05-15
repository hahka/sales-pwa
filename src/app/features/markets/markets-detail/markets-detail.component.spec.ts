import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketsDetailComponent } from './markets-detail.component';

describe('MarketsDetailComponent', () => {
  let component: MarketsDetailComponent;
  let fixture: ComponentFixture<MarketsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
