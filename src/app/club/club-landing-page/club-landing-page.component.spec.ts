import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubLandingPageComponent } from './club-landing-page.component';

describe('ClubLandingPageComponent', () => {
  let component: ClubLandingPageComponent;
  let fixture: ComponentFixture<ClubLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
