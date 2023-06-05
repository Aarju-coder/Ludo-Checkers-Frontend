import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgentSuccessComponent } from './add-agent-success.component';

describe('AddAgentSuccessComponent', () => {
  let component: AddAgentSuccessComponent;
  let fixture: ComponentFixture<AddAgentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAgentSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
