import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinRequestComponent } from './coin-request.component';

describe('CoinRequestComponent', () => {
  let component: CoinRequestComponent;
  let fixture: ComponentFixture<CoinRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
