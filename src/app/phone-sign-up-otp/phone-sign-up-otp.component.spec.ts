import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneSignUpOtpComponent } from './phone-sign-up-otp.component';

describe('PhoneSignUpOtpComponent', () => {
  let component: PhoneSignUpOtpComponent;
  let fixture: ComponentFixture<PhoneSignUpOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneSignUpOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneSignUpOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
