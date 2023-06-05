import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectClubRequestComponent } from './connect-club-request.component';

describe('ConnectClubRequestComponent', () => {
  let component: ConnectClubRequestComponent;
  let fixture: ComponentFixture<ConnectClubRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectClubRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectClubRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
