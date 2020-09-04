import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducingComponent } from './producing.component';

describe('ProducingComponent', () => {
  let component: ProducingComponent;
  let fixture: ComponentFixture<ProducingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
