import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupsuccessComponent } from './popupsuccess.component';

describe('PopupsuccessComponent', () => {
  let component: PopupsuccessComponent;
  let fixture: ComponentFixture<PopupsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
