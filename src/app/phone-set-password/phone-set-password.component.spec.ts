import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneSetPasswordComponent } from './phone-set-password.component';

describe('PhoneSetPasswordComponent', () => {
  let component: PhoneSetPasswordComponent;
  let fixture: ComponentFixture<PhoneSetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneSetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneSetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
