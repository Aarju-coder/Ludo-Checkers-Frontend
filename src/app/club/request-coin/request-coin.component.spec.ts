import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCoinComponent } from './request-coin.component';

describe('RequestCoinComponent', () => {
  let component: RequestCoinComponent;
  let fixture: ComponentFixture<RequestCoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestCoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
