import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudoSettingBtnComponent } from './ludo-setting-btn.component';

describe('LudoSettingBtnComponent', () => {
  let component: LudoSettingBtnComponent;
  let fixture: ComponentFixture<LudoSettingBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoSettingBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LudoSettingBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
