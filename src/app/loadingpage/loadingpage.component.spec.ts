import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingpageComponent } from './loadingpage.component';

describe('LoadingpageComponent', () => {
  let component: LoadingpageComponent;
  let fixture: ComponentFixture<LoadingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
