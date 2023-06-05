import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { AddAgentSuccessComponent } from '../club/add-agent-success/add-agent-success.component';
import { GlobalDetailsClub } from '../club/clubGlobalVars';
import { ClubApiServicesService } from '../club/services/club-api-services.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-phone-sign-up-otp',
  templateUrl: './phone-sign-up-otp.component.html',
  styleUrls: ['./phone-sign-up-otp.component.css']
})
export class PhoneSignUpOtpComponent implements OnInit {

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;

  @ViewChild(AddAgentSuccessComponent)
  addSuccess:AddAgentSuccessComponent=new AddAgentSuccessComponent;

  constructor(private router: Router, private globalclub: GlobalDetailsClub,private global: GlobalDetails, public apiClub:ClubApiServicesService,private api: ApiServiceService,
    private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }
    getGlobal :any;
    phone: any;
    phNumber: any;
    code: any;
    apiCall :any;
  ngOnInit(): void {

    if(this.global.isClub == true && this.global.isAccessClub){
      this.getGlobal = this.globalclub;
      if(this.globalclub.isforgotPwd)this.phone=this.globalclub.phnum;
      else this.phone=this.globalclub.agentPhone;
      this.apiCall = this.apiClub;
    } 
    if(this.global.isClub == false || !this.global.isAccessClub){
      this.getGlobal = this.global;
      this.phone = this.global.myphone;
      this.apiCall = this.api;
    }
  //  this.phNumber = this.code + ' ' + this.phone;
    this.phNumber = this.phone;
    //this.code = this.global.countryCode;
  }
  // phone:any=this.global.myEmail
  
  agentPopupClosed(evt:any){
    this.router.navigateByUrl("ownerDashboard");
  }
 
  otp: any;
  // otpvalidation:any;

  checkOtp() {
    this.soundService.playAudio('click');
    // this.router.navigateByUrl("setPassword")
    this.getGlobal.OTP = this.otp;

    if (this.getGlobal.isforgotPwd) {
      this.apiCall.phoneOtpVerificationResend().subscribe((data:any) => {
        var otpVarify = data
        console.log(otpVarify)
        if (otpVarify ) {
          if(otpVarify.message != 'Wrong otp entered' && (this.global.isClub==false || !this.global.isAccessClub))this.router.navigateByUrl('phoneSetPassword');
          else if(otpVarify.message != 'Wrong otp entered'&& this.global.isClub==true && this.global.isAccessClub && this.globalclub.isforgotPwd) {
            this.router.navigateByUrl('setPwdaccessclub');
           }
          else{
            this.messagePopUp.isVisible= true;
           this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongOTP[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
        }
        else {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.enterOTP[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }

      });
    } else {
      this.apiCall.phoneOtpVerification().subscribe((data:any) => {
        var otpVarify = data
        console.log(otpVarify)
        if (otpVarify) {
          if(otpVarify.message != 'Wrong otp entered' && (this.global.isClub==false || !this.global.isAccessClub))this.router.navigateByUrl('phoneSetPassword');
          else if(otpVarify.message != 'Wrong otp entered' && this.global.isClub==true && this.global.isAccessClub) {
            this.apiClub.addAgentManual().subscribe((result)=>{
              console.log(result);
              
              this.addSuccess.isVisible=true;
              this.addSuccess.popupmsg=result.message;
              // if(result.message !="Error Adding Agent" || result.message !="User already part of other club")
              // {
              //   this.addSuccess.popupmsg=result.message;
              // }
              // else{
              //   this.addSuccess.popupmsg='Agent Added successfully.';
              // }
          },(e: any) => {
            this.messagePopUp.isVisible= true;
            if(e.error.message!= null) {
            this.messagePopUp.popupMessage = "Invalid credentials";
            }else {
              this.messagePopUp.popupMessage = "Connection error. Try Again.";
            }
            setTimeout(()=>{this.messagePopUp.isVisible=false;
              },2000)
            //alert(JSON.stringify(e.error.message));
            //if(JSON.stringify(e.error.message)=="")
            });
          }
          else{
            this.messagePopUp.isVisible= true;
            this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongOTP[this.langModel.lang];
            this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
        }
        else {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.enterOTP[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }

      });
    }
    // console.log(this.otpvalidation)
    // if(this.otpvalidation === true){


    // }

  }
  onClaim(evt: any) {
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible = false;
  }
  resend() {
    this.soundService.playAudio('click');
    if(this.getGlobal.isforgotPwd){
      this.apiCall.phoneOtpResend().subscribe((data:any)=>{
      console.log( data," this.res this.res");
    });
  }
  else{
    this.apiCall.phoneOtp().subscribe((data:any)=>{
      console.log( data," this.res this.res");
    });
  }
  }

  back() {
    this.soundService.playAudio('click');
    if(this.global.isClub==false || !this.global.isAccessClub) this.router.navigateByUrl("register");
    else if(this.global.isClub==true && this.global.isAccessClub && this.globalclub.isforgotPwd) this.router.navigateByUrl("forgotpwdaccessclub");
    else if(this.global.isClub==true && this.global.isAccessClub && !this.globalclub.isforgotPwd) this.router.navigateByUrl("addAgentManually");

}

}

