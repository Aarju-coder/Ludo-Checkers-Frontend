import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-phone-set-password',
  templateUrl: './phone-set-password.component.html',
  styleUrls: ['./phone-set-password.component.css']
})
export class PhoneSetPasswordComponent implements OnInit {
  password: string = "";
  confirmPassword: string = "";
  isFail: string = "";
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;

  constructor( private global: GlobalDetails, private api: ApiServiceService, private router: Router
    , private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
  }
  validatepassword(){
    this.soundService.playAudio('click');
    console.log("globalEmail in SetPasswordComponent------>",this.global.myEmail);
    if(this.password.length >= 8){
      if(this.password !== this.confirmPassword){
     // alert("Passwords Do not match");
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.pwdMatch[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];

      }else if(this.password === this.confirmPassword){
      this.global.password = this.password;
      this.register();      
      }
    }else{
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.pwdWrong[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
   }
  }
  register(){
    {
      console.log('phoneRegistration')
      this.api.phoneSignUp().subscribe((data) => {
        var response = data;
        console.log("response---------->",response);
        this.global.authToken = response.authToken;
        this.global.userId = response.userId;
        this.localDb.setGameSessionData();
        //alert("You have registered successfully");
        this.messagePopUp.isVisible= true;
        if(this.global.isforgotPwd) this.messagePopUp.popupMessage = this.langModel.componentLang.popups.successpwd[this.langModel.lang];
      else this.messagePopUp.popupMessage = this.langModel.componentLang.popups.registerSuccess[this.langModel.lang];
     
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        this.isFail = 'successfull';
        
        
      },(e: any) => {
        //alert(JSON.stringify(e.error.message));
        this.messagePopUp.isVisible= true;
        if(e.error.message!= null) {
          this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
          }else {
            this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
        this.isFail = 'error';
       // this.router.navigateByUrl('landingPage');
        });
    }
  }

  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    
    if(evt == 'close'){
      if(this.isFail == 'successfull' ){
        if(this.global.isforgotPwd) this.router.navigateByUrl('phoneLogin');
        else {
          this.global.emailVerified = false;
          this.global.phoneVerified = true;
          this.router.navigateByUrl('user-details');
        }
      } 
     // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
    this.isFail = '';
    }
  }

}
