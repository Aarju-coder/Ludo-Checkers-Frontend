import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckersPlayWFriendsComponent } from './checkers-play-wfriends.component';

describe('CheckersPlayWFriendsComponent', () => {
  let component: CheckersPlayWFriendsComponent;
  let fixture: ComponentFixture<CheckersPlayWFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckersPlayWFriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckersPlayWFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
