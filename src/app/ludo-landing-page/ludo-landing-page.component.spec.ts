import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoLandingPageComponent } from './ludo-landing-page.component';

describe('LudoLandingPageComponent', () => {
  let component: LudoLandingPageComponent;
  let fixture: ComponentFixture<LudoLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LudoLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
