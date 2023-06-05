import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessclubForgotPasswordComponent } from './accessclub-forgot-password.component';

describe('AccessclubForgotPasswordComponent', () => {
  let component: AccessclubForgotPasswordComponent;
  let fixture: ComponentFixture<AccessclubForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessclubForgotPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessclubForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
