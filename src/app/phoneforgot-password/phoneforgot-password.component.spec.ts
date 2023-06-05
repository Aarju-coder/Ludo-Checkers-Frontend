import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneforgotPasswordComponent } from './phoneforgot-password.component';

describe('PhoneforgotPasswordComponent', () => {
  let component: PhoneforgotPasswordComponent;
  let fixture: ComponentFixture<PhoneforgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneforgotPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneforgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
