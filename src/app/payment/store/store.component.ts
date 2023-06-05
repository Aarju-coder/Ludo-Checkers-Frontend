import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { LanguageModel } from 'src/app/language/langModel';
import { MessagepopupComponent } from 'src/app/messagepopup/messagepopup.component';

import { PayPopupComponent } from '../payment-popup/pay-popup.component';
import { interval, Subscription} from 'rxjs';
import { NgxUiLoaderService } from "ngx-ui-loader"; 
import { AgentPaymentHistoryComponent } from 'src/app/club/agent-payment-history/agent-payment-history.component';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { ApiServiceService } from 'src/services/api-service.service';
import { GlobalDetailsClub } from 'src/app/club/clubGlobalVars';
import { ClubApiServicesService } from 'src/app/club/services/club-api-services.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  @ViewChild(PayPopupComponent)
  payPopUp: PayPopupComponent = new PayPopupComponent;

  // @ViewChild(MessagepopupComponent)
  // messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  coinArr =[
    {coin: 10,money: 200 ,class: 'coin'},
    {coin: 20,money: 500 ,class: 'two-coin'},
    {coin: 50,money: 1000 ,class: 'three-coin'},
    {coin: 100,money: 2000 ,class: 'four-coin'},
    {coin: 500,money: 5190 ,class: 'four-coin'},
    {coin: 1000,money: 10380 ,class: 'coin-potli'},
    {coin: 1000,money: 25950 ,class: 'coin-box'}
  ];
  constructor(private router: Router,public globalClub:GlobalDetailsClub,public global:GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel, public api:ApiServiceService,public apiClub:ClubApiServicesService,private ngxService: NgxUiLoaderService) { }
apiCall :any;
  ngOnInit(): void {
    // this.coinArr =[
    //   {coin: 10,money: this.global.moneyVal * 10 ,class: 'coin'},
    //   {coin: 20,money: this.global.moneyVal * 20 ,class: 'two-coin'},
    //   {coin: 50,money: this.global.moneyVal * 50 ,class: 'three-coin'},
    //   {coin: 100,money: this.global.moneyVal * 100 ,class: 'four-coin'},
    //   {coin: 500,money: this.global.moneyVal * 500 ,class: 'coin-potli'},
    //   {coin: 1000,money: this.global.moneyVal * 1000 ,class: 'coin-box'}
    // ];
    if(this.global.isClub == false)this.apiCall = this.api;
    if(this.global.isClub == true)this.apiCall = this.apiClub;
  }
  cardClick(amount:any){
    this.soundService.playAudio('click');
    this.payPopUp.isVisible= true;
    this.payPopUp.isErr =false;
    this.payPopUp.amountSelected= amount;
    if(this.global.isClub == false)this.global.payAmt = amount;
    if(this.global.isClub == true)this.globalClub.payAmt = amount;
    

    this.payPopUp.heading = this.langModel.componentLang.paymentPopup.heading[this.langModel.lang];
    this.payPopUp.subheading = this.langModel.componentLang.paymentPopup.subheading[this.langModel.lang];
    this.payPopUp.expressHead = this.langModel.componentLang.paymentPopup.expressHead[this.langModel.lang];
    this.payPopUp.vposHead = this.langModel.componentLang.paymentPopup.vposHead[this.langModel.lang];
    this.payPopUp.payStatusHead = this.langModel.componentLang.paymentPopup.status[this.langModel.lang];
    this.payPopUp.vpos = this.langModel.componentLang.paymentPopup.vpos[this.langModel.lang];
    this.payPopUp.express = this.langModel.componentLang.paymentPopup.express[this.langModel.lang];
    this.payPopUp.yes = this.langModel.componentLang.paymentPopup.yes[this.langModel.lang];
    this.payPopUp.no = this.langModel.componentLang.paymentPopup.no[this.langModel.lang];
    //this.payPopUp.expRef = this.langModel.componentLang.paymentPopup.expRef[this.langModel.lang];
    this.payPopUp.amountText = this.langModel.componentLang.refList.amount[this.langModel.lang];
    this.payPopUp.refNumText = this.langModel.componentLang.refList.refNum[this.langModel.lang];
    this.payPopUp.refIdText = this.langModel.componentLang.refList.refID[this.langModel.lang];
    this.payPopUp.entityidText = this.langModel.componentLang.refList.entityid[this.langModel.lang];
    this.payPopUp.transactionText = this.langModel.componentLang.refList.transactionText[this.langModel.lang];
    this.payPopUp.language = this.langModel.lang;
    this.payPopUp.footRef = this.langModel.componentLang.paymentPopup.footRef[this.langModel.lang];
    this.payPopUp.successRef = this.langModel.componentLang.paymentPopup.successRef[this.langModel.lang];
    // this.payPopUp.vposPayStatus = this.langModel.componentLang.paymentHistory.rejected[this.langModel.lang];
    
    console.log("testAmt", amount, this.payPopUp.amountSelected);
  }
  back(){
    this.soundService.playAudio('click');
    if(this.global.isClub == false)
     {
      if(this.global.gameName =="Ludo" || this.global.gameName =="Checkers"){
        this.global.isPlaying =true;
        this.router.navigateByUrl('ludoLandingPage');
      } 
      else this.router.navigateByUrl('landingPage');
    }
    else this.router.navigateByUrl('ownerDashboard');
  }
  // onClaim(evt:any){
  //   this.soundService.playAudio('click');
  //   this.messagePopUp.isVisible= false;
  //   if(evt == 'close'){
  //     // if(this.isFail == 'successfull') this.router.navigateByUrl('setProfile');
  //     // else if(this.isFail == 'error')this.router.navigateByUrl('register');
    
  //   }else{
  //     this.global.isStore = true;
  //     this.router.navigateByUrl('bank-info');
  //   }
  // }
  onPopupTap(evt:any){
    this.soundService.playAudio('click');
    if(evt.isPayment){
      if(evt.paymentMethod === 'vpos'){
          this.payPopUp.isPhnNum= true;
           this.payPopUp.phnNumHeading = this.langModel.componentLang.paymentPopup.phnNumHeading[this.langModel.lang];
           if(this.global.isClub == false)this.payPopUp.expPhoneNumber = this.global.expPhoneNumber;
           if(this.global.isClub == true)this.payPopUp.expPhoneNumber = this.globalClub.expPhoneNumber;
           this.payPopUp.yes = this.langModel.componentLang.popups.next[this.langModel.lang];
        
      } else if(evt.paymentMethod === 'express'){
        this.apiCall.expressPaymentRef().subscribe((result:any) => {
          console.log('express payment', result);
          this.payPopUp.isExpressDone =true;
           this.payPopUp.EntityId = result.entityId;
           this.payPopUp.refNum = result.number;
          this.payPopUp.amountNum = result.amount;
          if(this.global.isClub == false)this.global.referenceId = result.referenceId;
          if(this.global.isClub == true)this.globalClub.referenceId = result.referenceId;
          
          if(result.referenceId){
            var timer2 = setTimeout(() => {
              this.expressTransactionDetails();
              clearTimeout(timer2);
            }, 5000);
          }
        });
      }
    }
    else{
      console.log(evt);
      
      if(this.global.isClub == false)this.global.expPhoneNumber = evt;
      if(this.global.isClub == true)this.global.expPhoneNumber = evt;
      this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
      // Stop the foreground loading after 5s
      this.apiCall.vposPaymentRequest().subscribe((result:any) => {
        console.log('vpos payment', result);
        if(result.success == true){
        this.payPopUp.isExpressDone =true;
        this.payPopUp.transactionId = result.transactionId;
        if(this.global.isClub == false)this.global.transactionId = result.transactionId;
        if(this.global.isClub == true)this.globalClub.transactionId = result.transactionId;
        
        // this.payPopUp.EntityId = "0";//result.
        // this.payPopUp.refId = result.referenceId;
        this.payPopUp.amountNum = result.amt;
        if(result.transactionId){
          var timer= setTimeout(() => {
            this.vposTransactionDetails();
            clearTimeout(timer);
          }, 5000);
        }
      }
      else{
        this.payPopUp.isExpressDone =true;
        this.payPopUp.errorMsg = this.langModel.componentLang.paymentPopup.errormsg[this.langModel.lang];
        this.payPopUp.isErr =true;
        this.ngxService.stop();
      }
      },
      (err:any)=>{
          this.payPopUp.isExpressDone =true;
          this.payPopUp.errorMsg = this.langModel.componentLang.paymentPopup.errormsg[this.langModel.lang];
          this.payPopUp.isErr =true;
          this.ngxService.stop();
        
      });
    }
  }

  vposTransactionDetails(){
    console.log(this.global.transactionId,this.globalClub.transactionId);
    this.apiCall.vposPaymentDetails().subscribe((result:any) => {
      console.log(result);
      this.payPopUp.vposPayStatus = result.status;
      if(this.payPopUp.vposPayStatus == 'rejected'){
        if(this.langModel.lang == 'en') 
        this.payPopUp.vposPayStatus = 'Payment Rejected';
        else this.payPopUp.vposPayStatus = 'Pagamento Rejeitado';
      }
      else if(this.payPopUp.vposPayStatus == 'accepted'){
        if(this.langModel.lang == 'en') 
        this.payPopUp.vposPayStatus = 'Payment is accepted and coins also updated';
        else this.payPopUp.vposPayStatus = 'Pagamento aceito e moedas também atualizadas';
      }else{
        if(this.langModel.lang == 'en') 
        this.payPopUp.vposPayStatus = 'Payment is pending';
        else this.payPopUp.vposPayStatus = 'O pagamento está pendente';
      }
      
         
      if(this.payPopUp.vposPayStatus != null || this.payPopUp.vposPayStatus != ""){
        this.ngxService.stop();
      }
    },(err:any)=>{
      console.log(err,"errr");
      this.payPopUp.isExpressDone =true;
      this.payPopUp.errorMsg = this.langModel.componentLang.paymentPopup.errormsg[this.langModel.lang];
      this.payPopUp.isErr =true;
      this.ngxService.stop();
    });
  }

  expressTransactionDetails(){
   // console.log(this.global.referenceId);
    this.apiCall.ExpressRefDetailByRefId().subscribe((result:any) => {
      console.log(result);
    });
  }
}
