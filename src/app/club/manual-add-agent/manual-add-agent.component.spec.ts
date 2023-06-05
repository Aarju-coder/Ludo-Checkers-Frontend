import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAddAgentComponent } from './manual-add-agent.component';

describe('ManualAddAgentComponent', () => {
  let component: ManualAddAgentComponent;
  let fixture: ComponentFixture<ManualAddAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualAddAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualAddAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
