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
  selector: 'app-email-otp',
  templateUrl: './email-otp.component.html',
  styleUrls: ['./email-otp.component.css']
})
export class EmailOtpComponent implements OnInit {

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  @ViewChild(AddAgentSuccessComponent)
  addSuccess:AddAgentSuccessComponent=new AddAgentSuccessComponent;
  constructor(private router:Router,private globalclub: GlobalDetailsClub,private global: GlobalDetails, public apiClub:ClubApiServicesService,private api: ApiServiceService,
    private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }
    
    email:any
    otp:any;
    getGlobal :any;
    apiCall :any;

  ngOnInit(): void {
    if(this.global.isClub == true && this.global.isAccessClub){
      this.getGlobal = this.globalclub;
      if(this.globalclub.isforgotPwd)this.email=this.globalclub.email;
      else this.email=this.globalclub.agentEmail;
      this.apiCall = this.apiClub;
    } 
    if(this.global.isClub == false || !this.global.isAccessClub){
      console.log("club is false");
      this.getGlobal = this.global;
      this.email=this.global.myEmail;
      this.apiCall = this.api;
    }
  }
 
  checkOtp(){
    this.soundService.playAudio('click');
    this.apiCall.verifyOtpEmail(this.otp).subscribe((data:any) => {
      var response = data;
      console.log("response---------->",response);
      if(response.message != 'Invalid OTP'&& (this.global.isClub==false || !this.global.isAccessClub))this.router.navigateByUrl('setPassword');
      else if(response.message != 'Invalid OTP'&& this.global.isClub==true && this.global.isAccessClub &&this.globalclub.isforgotPwd) {
       this.router.navigateByUrl('setPwdaccessclub');
      }
      else if(response.message != 'Invalid OTP'&& this.global.isClub==true && this.global.isAccessClub && !this.globalclub.isforgotPwd) {
       /// alert("agent added");
        this.apiClub.addAgentManual().subscribe((result)=>{
          console.log(result,"manuall added done");
          this.addSuccess.isVisible=true;
          // if(result.message !="Error Adding Agent" || result.message !="User already part of other club")
          // {
          //   this.addSuccess.popupmsg=result.message;
          // }
          // else{
          //   this.addSuccess.popupmsg='Agent Added successfully.';
          // }
          this.addSuccess.popupmsg=result.message;
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
      
      
    },(e: any) => {
      //alert(JSON.stringify(e.error.message));
      this.messagePopUp.isVisible= true;
      if(e.error.message!= null) {
        this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
        }else {
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
      //this.isFail = 'error';
     // this.router.navigateByUrl('landingPage');
      });
    //this.router.navigateByUrl("resetPassword")
  }
  agentPopupClosed(evt:any){
    this.router.navigateByUrl("ownerDashboard");
  }
  resend(){
    this.soundService.playAudio('click');
    this.apiCall.getOtpEmail().subscribe((data:any) => {
      var response = data;
      console.log("response---------->",response);
      if(response.success){
        this.messagePopUp.isVisible= true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.successOtp[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      }
      // this.global.authToken = response.status;
      // this.global.userId = response.message;
      // //alert("You have registered successfully");
      // this.messagePopUp.isVisible= true;
      // this.messagePopUp.popupMessage = 'You have registered successfully.';
      // this.isFail = 'successfull';
      
      
    },(e: any) => {
      //alert(JSON.stringify(e.error.message));
      this.messagePopUp.isVisible= true;
      if(e.error.message!= null) {
        this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
        }else {
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
     // this.router.navigateByUrl('landingPage');
      });
  }

  back(){
    this.soundService.playAudio('click');
    if(this.global.isClub==false || !this.global.isAccessClub) this.router.navigateByUrl("register");
    else if(this.global.isClub==true && this.global.isAccessClub && this.globalclub.isforgotPwd) this.router.navigateByUrl("forgotpwdaccessclub");
    else if(this.global.isClub==true && this.global.isAccessClub && !this.globalclub.isforgotPwd) this.router.navigateByUrl("addAgentManually");
  }
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    if(evt == 'close'){
      //this.isFail == 'successfull') this.router.navigateByUrl('homePage');
     // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
   // this.isFail = '';
    }
  }

}
