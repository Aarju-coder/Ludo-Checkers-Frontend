import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-request-coin',
  templateUrl: './request-coin.component.html',
  styleUrls: ['./request-coin.component.css']
})
export class RequestCoinComponent implements OnInit {

  isVisible:boolean=false;
  Tcoin:any;
  ownerID:any;
  @Output() onRequest= new EventEmitter<any>()
  constructor() { }

  ngOnInit(): void {
    
  }
  close(){
    this.isVisible=false
  }
  requestCoin(){
    let data:any;
    data={coin:this.Tcoin};
    
    this.onRequest.emit(data);
    this.isVisible=false;
    this.ownerID=""
    this.Tcoin=""
    
  }

}
