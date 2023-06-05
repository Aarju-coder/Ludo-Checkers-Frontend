import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-connect-club',
  templateUrl: './connect-club.component.html',
  styleUrls: ['./connect-club.component.css']
})
export class ConnectClubComponent implements OnInit {
  error: string = '';
  phNumber:number | undefined;
  @Output() connection= new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  close(){
    this.connection.emit('close');
  }
  connectSuccess(){
    if(this.phNumber == undefined || this.phNumber == null || !this.phoneCheck(this.phNumber)){
      this.error = "*Please enter correct number."
      return;
    }
    this.connection.emit('success');
  }
  phoneCheck(phone:any){
    var re = /[0-9]{6,14}/;
    if (!(re.test(phone))) {
      return false;
    }
    else{
      return true;
    }	

  }
}
