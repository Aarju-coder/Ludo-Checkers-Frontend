import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckersInviteFriendsComponent } from './checkers-invite-friends.component';

describe('CheckersInviteFriendsComponent', () => {
  let component: CheckersInviteFriendsComponent;
  let fixture: ComponentFixture<CheckersInviteFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckersInviteFriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckersInviteFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
