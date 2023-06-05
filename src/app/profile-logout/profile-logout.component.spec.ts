import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLogoutComponent } from './profile-logout.component';

describe('ProfileLogoutComponent', () => {
  let component: ProfileLogoutComponent;
  let fixture: ComponentFixture<ProfileLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileLogoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
