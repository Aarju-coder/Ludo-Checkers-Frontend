import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { MessagepopupComponent1 } from '../messagepopup/messagepopup.component';
import { ClubApiServicesService } from '../services/club-api-services.service';
import { UpdateCoinRequestComponent } from '../update-coin-request/update-coin-request.component';

@Component({
  selector: 'app-coin-request',
  templateUrl: './coin-request.component.html',
  styleUrls: ['./coin-request.component.css']
})
export class CoinRequestComponent implements OnInit {
  @ViewChild(UpdateCoinRequestComponent)
  updateCoinRequest:UpdateCoinRequestComponent=new UpdateCoinRequestComponent;
  @ViewChild(MessagepopupComponent1)
  messagepopup:MessagepopupComponent1=new MessagepopupComponent1;
  public requests: any = [];
  constructor(private router:Router,private api:ClubApiServicesService, private global:GlobalDetailsClub) { }

      /* pagination */
      p: number = 1;
      pageNumber: number = 1;
      limit: number = 20;
      total: number | undefined;
      coinRequestPage: number = 1;

      handleViewAgentPage(event:any){
        this.coinRequestPage = event;
        console.log(event);
      }

      getCoinRequestPage(pageNo: number){
        if(pageNo > this.p){
          this.coinRequest(pageNo);
        }
        this. pageNumber = pageNo;
        // this.p = pageNo;
        
        console.log("pagination ", pageNo);
      }

  ngOnInit(): void {
    this.requests=this.global.coinRequestList;
    console.log(this.requests,"this.requeststhis.requests");
    // this.requestList();

  }
  requestList(){
    this.coinRequest(this.coinRequestPage);
  }
  coinRequest(p: number){
    if(p >= this.p){
      try{
      this.p = p;
      this.api.viewRequestedTransaction().subscribe((result) => {
        var pushRows: any = [];
        for(let i = 0;i< this.requests.length; i++){
          pushRows.push(this.requests[i]);
        }
        for(let i = 0;i< result.length; i++){
          pushRows.push(result[i]);
        }
        
        this.requests = pushRows;
        if(p == 1)
        this.total = 20;
        else
        this.total = this.total + result.length;
        console.log('coin request total >>>>', this.total);
        console.log('coin request list >>>>', this.requests);
      })}catch(error:any){
        console.log('error >>>>', error);
        var pushRows: any = [];
        for(let i = 0;i< this.requests.length; i++){
          pushRows.push(this.requests[i]);
        }
      this.requests = pushRows;
      };
    } else{
      var pushRows: any = [];
        for(let i = 0;i< this.requests.length; i++){
          pushRows.push(this.requests[i]);
        }
        this.requests = pushRows;
    }
  }
  back(){
  this.router.navigateByUrl("ownerDashboard");
  }
  dataIndex :any =0;
  requestClick(data:any, index:any){
    console.log(data,">>>>>>>>data");
    this.dataIndex = index;
    this.updateCoinRequest.data=data;
    this.updateCoinRequest.isVisible=true;
  }
  onAction(actionData:any){
    this.updateCoinRequest.isVisible=false;
    // console.log(actionData);
    this.global.recieverUserId=actionData.receiverUserId;
    this.global.transactionCoin=actionData.transactionAmountCoins;
    this.global.requestMsg=actionData.requestMsg;
    this.api.updateRequestTransaction().subscribe((result)=>{
      console.log(result,this.dataIndex,"this.dataIndexthis.dataIndex");
      if(result.success){
        this.messagepopup.isVisible= true;
        this.messagepopup.popupMessage = "Coin Request "+this.global.requestMsg;
        console.log(this.requests,"this.requeststhis.requests");
    }
      else{
        this.messagepopup.isVisible= true;
        this.messagepopup.popupMessage = result.msg;
      }
      var timer = setTimeout(()=>{
        this.messagepopup.isVisible=false;
        if(result.msg !="Sender have Insufficient balance")this.requests.splice(this.dataIndex, 1);
        clearTimeout(timer);
      },1000);
     // this.requestList();

    },(e: any) => {
      this.messagepopup.isVisible= true;
      if(e.error.message!= null) {
      this.messagepopup.popupMessage = "Invalid UserID";
      }else {
        this.messagepopup.popupMessage = "Connection error. Try Again.";
      }
      setTimeout(()=>{this.messagepopup.isVisible=false},2000)
      //alert(JSON.stringify(e.error.message));
      //if(JSON.stringify(e.error.message)=="")
      });

  }
}
