import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoComponent } from './ludo.component';

describe('LudoComponent', () => {
  let component: LudoComponent;
  let fixture: ComponentFixture<LudoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
