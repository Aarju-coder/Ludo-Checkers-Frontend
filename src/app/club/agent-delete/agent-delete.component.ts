import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-agent-delete',
  templateUrl: './agent-delete.component.html',
  styleUrls: ['./agent-delete.component.css']
})
export class AgentDeleteComponent implements OnInit {
  isVisible:boolean=false;
  constructor() { }
  isBlock:boolean=false;
  isUnblock:boolean=false;
  @Output() agentStatus= new EventEmitter<number>()
  ngOnInit(): void {
  }
  close(){
    this.isVisible=false;
  }
  block(){
    let status;
    status=0;
    this.agentStatus.emit(status);
    this.isVisible=false;
  }
  unblock(){
    let status;
    status=1
    this.agentStatus.emit(status);
    this.isVisible=false;
  }

}
