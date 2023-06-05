import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPaymentDetailComponent } from './agent-payment-detail.component';

describe('AgentPaymentDetailComponent', () => {
  let component: AgentPaymentDetailComponent;
  let fixture: ComponentFixture<AgentPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentPaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
