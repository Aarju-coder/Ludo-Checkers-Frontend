import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoWinnerPopUpComponent } from './ludo-winner-pop-up.component';

describe('LudoWinnerPopUpComponent', () => {
  let component: LudoWinnerPopUpComponent;
  let fixture: ComponentFixture<LudoWinnerPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoWinnerPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LudoWinnerPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
