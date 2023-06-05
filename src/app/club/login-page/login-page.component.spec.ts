import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubLoginPageComponent } from './login-page.component';

describe('ClubLoginPageComponent', () => {
  let component: ClubLoginPageComponent;
  let fixture: ComponentFixture<ClubLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubLoginPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
