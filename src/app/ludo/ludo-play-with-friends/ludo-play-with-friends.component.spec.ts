import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoPlayWithFriendsComponent } from './ludo-play-with-friends.component';

describe('LudoPlayWithFriendsComponent', () => {
  let component: LudoPlayWithFriendsComponent;
  let fixture: ComponentFixture<LudoPlayWithFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoPlayWithFriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LudoPlayWithFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
