import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { MessagepopupComponent1 } from '../messagepopup/messagepopup.component';
import { RechargeAccountComponent } from '../recharge-account/recharge-account.component';
import { ClubApiServicesService } from '../services/club-api-services.service';
import { LocalDbClubService } from '../services/club-local-db-club.service';
import { ApiServiceService as APiAPi } from '../../../services/api-service.service'
import { LocalDbService as Globaldb } from '../../../services/local-db.service'
@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent implements OnInit {

  coins:number = 0;
  coinValue:any=0;
  numberRequest:number=0
  coinRequestDisplay:string='';
  isCoinRequest:boolean=false;

  @ViewChild(RechargeAccountComponent)
  rechargeAccount:RechargeAccountComponent= new RechargeAccountComponent;
  @ViewChild(MessagepopupComponent1)
  messagepopup:MessagepopupComponent1=new MessagepopupComponent1;
  constructor(private router:Router, private api:ClubApiServicesService,public global:GlobalDetailsClub , private localDb:LocalDbClubService, private apiGlobal: APiAPi, public localDbGlobal: Globaldb) { }

  ngOnInit(): void {
    this.global.isforgotPwd = false;
    if (!this.global.userId){this.checkIfLoggedIn()}
    else if(this.global.userId){
      console.log("response is existtt---------->");
      this.getCoins();
      
    }
    this.global.userRole="ClubOwner";
    this.coinRequestList();
    this.showClubName();
    this.api.viewAgent().subscribe((result)=>{
      console.log(result);
      this.global.agentList=result.agentDetailsList;
      this.global.clubId=result.clubId
      console.log(this.global.clubId);
    })
 
  }
  

  getCoins(){
    this.api.getCoin().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
     this.global.coins = (response.coins).toFixed(2);
     console.log("this.global.coinsthis.global.coins",this.global.coins);
     //this.global.moneyAmt = response.money;
     this.getRealMoney();
      
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
  getRealMoney(){
    this.api.getCoinValue().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
    // this.global.coins = response.coins;
     this.global.moneyAmt = (this.global.coins * response[0].value).toFixed(2);
     this.global.moneyVal = (response[0].value).toFixed(2);
     this.localDb.setAccessClubSessionData();
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
  
  back(){
    this.router.navigateByUrl("clubLanding");
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
  coinRequestList(){
    this.api.viewRequestedTransaction().subscribe((result)=>{
      console.log(result);
      this.global.coinRequestList=result;
      console.log(this.global.coinRequestList,"this.global.coinRequestList");
      this.numberRequest=this.global.coinRequestList.length;
      if(this.global.coinRequestList.length>0){this.coinRequestDisplay='inline-block';
    this.isCoinRequest=true;}
    })
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
       this.getCoins(); 
     }
     else{
        console.log("user not login");
       this.router.navigateByUrl('accessClub');
     }
  }
  recharge(){
    this.rechargeAccount.isVisible=true;
  }
  onRecharge(e:any){
    if(e){
      
      if(e[0].includes(".com")){
        this.global.recEmail=e[0];
      }
      else{
        this.global.recID=e[0];
      }
      this.global.transactionCoin=e[1];
     if(this.global.transactionCoin>0) {this.api.givingCoin().subscribe((result)=>{
        console.log(result);
        this.messagepopup.isVisible=true;
        this.messagepopup.popupMessage=result.msg;
        setTimeout(()=>{this.messagepopup.isVisible=false;
          this.getCoins();
          },1500);
      })}
      else{
        this.messagepopup.isVisible=true;
        this.messagepopup.popupMessage="Entered Coin is Invalid!!!";
        setTimeout(()=>{this.messagepopup.isVisible=false;
         
          },1500);
      }
    }
  }
  onClaim(e:any){

  }
  
  logout(){
   // localStorage.clear();
    localStorage.removeItem('accessClubSessionDb');
    //sessionStorage.clear();
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
  buyCoinClicked(){
    this.router.navigateByUrl("store");
  }
  viewClicked(){
    this.router.navigateByUrl('viewAgent');
  }
  addClicked(){
    this.router.navigateByUrl('addAgent');
  }
  payHis(){
    this.router.navigateByUrl('ownerPaymentHistory');
  }
  coinRequest(){
    this.router.navigateByUrl("coinRequest");
  }
  connectClub(){
    this.router.navigateByUrl("connectClubRequest");
  }

}
