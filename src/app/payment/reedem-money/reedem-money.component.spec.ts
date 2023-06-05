import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReedemMoneyComponent } from './reedem-money.component';

describe('ReedemMoneyComponent', () => {
  let component: ReedemMoneyComponent;
  let fixture: ComponentFixture<ReedemMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReedemMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReedemMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
