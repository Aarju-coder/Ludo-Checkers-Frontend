import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPopupComponent } from './pay-popup.component';

describe('PayPopupComponent', () => {
  let component: PayPopupComponent;
  let fixture: ComponentFixture<PayPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
