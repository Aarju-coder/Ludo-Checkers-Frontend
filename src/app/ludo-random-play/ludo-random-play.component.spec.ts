import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoRandomPlayComponent } from './ludo-random-play.component';

describe('LudoRandomPlayComponent', () => {
  let component: LudoRandomPlayComponent;
  let fixture: ComponentFixture<LudoRandomPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoRandomPlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LudoRandomPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
