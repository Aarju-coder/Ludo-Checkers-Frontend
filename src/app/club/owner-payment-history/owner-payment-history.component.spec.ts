import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerPaymentHistoryComponent } from './owner-payment-history.component';

describe('OwnerPaymentHistoryComponent', () => {
  let component: OwnerPaymentHistoryComponent;
  let fixture: ComponentFixture<OwnerPaymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerPaymentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
