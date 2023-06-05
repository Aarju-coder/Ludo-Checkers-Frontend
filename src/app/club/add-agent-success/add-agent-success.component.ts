import { Component, EventEmitter,OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-agent-success',
  templateUrl: './add-agent-success.component.html',
  styleUrls: ['./add-agent-success.component.css']
})
export class AddAgentSuccessComponent implements OnInit {


  @Output() isClosed = new EventEmitter<string>();
  isVisible:boolean=false;
  popupmsg :string ='Agent Added successfully';
  constructor() { }

  ngOnInit(): void {
    console.log("popupppp added done");
  }
  close(){
    this.isVisible=false;
    this.isClosed.emit('close');
  }


}
