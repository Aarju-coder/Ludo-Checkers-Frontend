import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPaymentHistoryComponent } from './agent-payment-history.component';

describe('AgentPaymentHistoryComponent', () => {
  let component: AgentPaymentHistoryComponent;
  let fixture: ComponentFixture<AgentPaymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentPaymentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
