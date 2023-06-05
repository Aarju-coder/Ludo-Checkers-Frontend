import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagepopupComponent } from './messagepopup.component';

describe('MessagepopupComponent', () => {
  let component: MessagepopupComponent;
  let fixture: ComponentFixture<MessagepopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagepopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
