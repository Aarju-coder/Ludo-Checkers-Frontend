import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-messagepopup1',
  templateUrl: './messagepopup.component.html',
  styleUrls: ['./messagepopup.component.css']
})
export class MessagepopupComponent1 implements OnInit {

  isVisible =false;
  type ='';
  typeclose='';
  popupMessage ='Connection error. Try Again.';
  btnText= '';
  closetxt= 'Close';
  @Output() isClaimed = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
    // setTimeout(this.timeClose,1000);
  }
  // timeClose(){
  //   this.isVisible = false;
  // }
  close() {
    this.isVisible = false;
    this.isClaimed.emit('close');
  }
  onAction(type:any) {
    this.isClaimed.emit(type);
  }
}
