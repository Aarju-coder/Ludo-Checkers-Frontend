import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCoinRequestComponent } from './update-coin-request.component';

describe('UpdateCoinRequestComponent', () => {
  let component: UpdateCoinRequestComponent;
  let fixture: ComponentFixture<UpdateCoinRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCoinRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCoinRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
