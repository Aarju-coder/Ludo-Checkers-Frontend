import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-update-coin-request',
  templateUrl: './update-coin-request.component.html',
  styleUrls: ['./update-coin-request.component.css']
})
export class UpdateCoinRequestComponent implements OnInit {
  isVisible:boolean=false;
  data:any;
  actionData:any;
  constructor() { }
  @Output() isAction= new EventEmitter<string>();
  ngOnInit(): void {
    console.log(this.data);
  }
 close(){
  this.isVisible=false;
 }
 updateAction(action:string){
  console.log(action);
  this.actionData={requestMsg:action,receiverUserId:this.data.recieverUserId,transactionAmountCoins:this.data.transactionAmountCoins};
  console.log("actionData====>",this.actionData);
  this.isAction.emit(this.actionData); 
 }
}
