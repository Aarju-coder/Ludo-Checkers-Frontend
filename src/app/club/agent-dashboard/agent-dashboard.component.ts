import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { MessagepopupComponent1 } from '../messagepopup/messagepopup.component';
import { RechargeAccountComponent } from '../recharge-account/recharge-account.component';
import { RequestCoinComponent } from '../request-coin/request-coin.component';
import { ClubApiServicesService } from '../services/club-api-services.service';
import { LocalDbClubService } from '../services/club-local-db-club.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit {
  payHistory:any;
  coins:any = 0;
  coinValue:any=0;
  @ViewChild(RequestCoinComponent)
  requestCoin:RequestCoinComponent=new RequestCoinComponent;
  @ViewChild(RechargeAccountComponent)
  rechargeAccount:RechargeAccountComponent= new RechargeAccountComponent;
  @ViewChild(MessagepopupComponent1)
  messagepopup:MessagepopupComponent1=new MessagepopupComponent1;
  constructor(private router:Router,private api:ClubApiServicesService,private global:GlobalDetailsClub,private localDb:LocalDbClubService) { }

  ngOnInit(): void {
    
    if (!this.global.userId){this.checkIfLoggedIn()}
    else if(this.global.userId){
      this.coinNumber(); 
    }
    this.global.userRole="Agent";
    this.global.isforgotPwd = false;
   // this.showClubName();
  }
  coinNumber(){
    this.api.getCoin().subscribe((result)=>
          { 
            console.log(result);
            this.coins=result.coins;
            this.global.coins = (result.coins).toFixed(2);
            console.log("coin====>",this.coins);
            this.getcoinValue();
          });
  }

  getcoinValue(){
    this.api.getCoinValue().subscribe((result)=>{
      console.log(result);
      this.coinValue=result[0].value;
      this.global.moneyAmt = (this.global.coins * result[0].value).toFixed(2);
      this.global.moneyVal = (result[0].value).toFixed(2);
      this.localDb.setAccessClubSessionData();
      console.log("coinValue===>",this.coinValue);
    })
  }
  back(){
    this.router.navigateByUrl("clubLanding");
  }
  checkIfLoggedIn(){
    var dataSession =  this.localDb.getAccessClubSessionData();
    console.log(dataSession,"dataSessiondataSession");
    if(dataSession.length != 0)
     { 
      this.global.authToken = dataSession.authToken;
       this.global.userId = dataSession.userId;
       this.global.role = dataSession.role;
       this.global.email= dataSession.acessEmail;
       this.global.userName= dataSession.username;
       this.global.avatar =dataSession.avatar;
       this.global.coins=dataSession.coins;
       this.global.moneyAmt=dataSession.moneyAmt;
       this.global.moneyVal=dataSession.moneyVal;
       this.coinNumber();
     }
     else{
        console.log("user not login");
       this.router.navigateByUrl('accessClub');
     }
  }

  clubName= '';
  showClubName(){
    ///////club ka kam
    this.api.getClubName().subscribe((data) => {
      console.log("response---------->",data,data.message);
      this.clubName = data.message;
      
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
    //  this.router.navigateByUrl('landingPage');
      });
  }

  logout(){
    //localStorage.clear();
    localStorage.removeItem('accessClubSessionDb');
    this.global.role=null;
    this.global.authToken='';
    this.global.userId='';
    this.global.email ='';
    this.global.phnum = null;
    this.global.password ='';
    this.global.avatar = 1;
    this.global.userName = '';
    this.global.coins = 0;
    this.global.moneyAmt = 0;
    this.global.isforgotPwd = false;
    this.router.navigateByUrl("clubLanding");
  }
  reqCoin(){
    this.requestCoin.isVisible=true;
  }
  recharge(){
    this.rechargeAccount.isVisible=true;
  }
  onRecharge(e:any){
    if(e){
      //if(e[0].includes(".com")){
      let isnum = /^\d+$/.test(e[0]);
      if(!isnum){
        this.global.recEmail=e[0];
      }
      else{
        this.global.recID=e[0];
      }
      //this.global.recEmail=e[0];
     // this.global.recID=e[0];
      this.global.transactionCoin=e[1];
      if(this.global.transactionCoin>0){this.api.givingCoin().subscribe((result)=>{
        console.log(result);
        this.global.recEmail ="";
        this.global.recID ="";
        this.messagepopup.isVisible=true;
        this.messagepopup.popupMessage=result.msg;
        setTimeout(()=>{this.messagepopup.isVisible=false;
        this.coinNumber();},1500);
      },
      (err)=>{
        this.global.recEmail ="";
        this.global.recID ="";
      });}
      else{
        this.messagepopup.isVisible=true;
        this.messagepopup.popupMessage="Entered Coin is Invalid!!!";
        setTimeout(()=>{this.messagepopup.isVisible=false;
         
          },1500);
      }
    }
  }
  payHis(){
    this.router.navigateByUrl('agentPaymentHistory')
  }
  onRequestCoin(data:any){
    if (data.coin>0){
      // this.global.ownerID=data.ownerID;
      this.global.transaction_amount_coins=data.coin;
      this.api.requestClubPayment().subscribe((result)=>{
        console.log(result);
        this.messagepopup.isVisible=true;
        this.messagepopup.popupMessage=result.msg;
        setTimeout(()=>{this.messagepopup.isVisible=false;
          },1500);
        
      })
    }
  }

}
