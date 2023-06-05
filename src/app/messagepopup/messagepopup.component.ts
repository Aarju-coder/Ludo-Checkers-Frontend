import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-messagepopup',
  templateUrl: './messagepopup.component.html',
  styleUrls: ['./messagepopup.component.css']
})
export class MessagepopupComponent implements OnInit {
  isVisible =false;
  type ='';
  typeclose='';
  popupMessage ='Connection error. Try Again.';
  btnText= '';
  closetxt= 'Close';
 
  @Output() isClaimed = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  close() {
    
    if(this.type != "doNotQuit"){
      this.isClaimed.emit('close');
      this.isVisible = false;
    }
    else
    this.isClaimed.emit('doNotQuit')
  }
  onAction(type:any) {
    this.isClaimed.emit(type);
  }
 
}
