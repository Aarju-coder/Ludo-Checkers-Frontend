import { Component, OnInit, Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-recharge-account',
  templateUrl: './recharge-account.component.html',
  styleUrls: ['./recharge-account.component.css']
})
export class RechargeAccountComponent implements OnInit {


  playerID:any;
  Tcoin:any;
  isVisible:boolean=false;
  error: string = '';
  @Output() isRecharge = new EventEmitter<any>();
  constructor( ) { 
    this.error="";
  }

  ngOnInit(): void {
  }
  close(){
    this.error = "";
    this.isVisible=false;
    
  }
  recharge(){
    console.log("RECharge",this.playerID, " " ,this.Tcoin);
    if(this.playerID == undefined || this.Tcoin == undefined){
      console.log("RECharge");
      this.error = "*Please enter correct Details.";
      return;
    }
    let data=[this.playerID,this.Tcoin]
    this.isRecharge.emit(data);
    this.isVisible=false;
    this.playerID='';
    this.Tcoin='';
    this.error = "";
  }


}
