import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLandingPageComponent } from './game-landing-page.component';

describe('GameLandingPageComponent', () => {
  let component: GameLandingPageComponent;
  let fixture: ComponentFixture<GameLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
