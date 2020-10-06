import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotReadyDialogComponent } from './not-ready-dialog.component';

describe('NotReadyDialogComponent', () => {
  let component: NotReadyDialogComponent;
  let fixture: ComponentFixture<NotReadyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotReadyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotReadyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
