import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectClubComponent } from './connect-club.component';

describe('ConnectClubComponent', () => {
  let component: ConnectClubComponent;
  let fixture: ComponentFixture<ConnectClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
