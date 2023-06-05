import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessClubSetpasswordComponent } from './access-club-setpassword.component';

describe('AccessClubSetpasswordComponent', () => {
  let component: AccessClubSetpasswordComponent;
  let fixture: ComponentFixture<AccessClubSetpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessClubSetpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessClubSetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
