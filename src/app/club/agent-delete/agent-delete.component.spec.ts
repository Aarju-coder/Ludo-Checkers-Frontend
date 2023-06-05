import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDeleteComponent } from './agent-delete.component';

describe('AgentDeleteComponent', () => {
  let component: AgentDeleteComponent;
  let fixture: ComponentFixture<AgentDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
