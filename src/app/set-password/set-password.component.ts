import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalDetails } from '../globalVars';
import { ApiServiceService } from '../../services/api-service.service'
import { Router } from '@angular/router';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LanguageModel } from '../language/langModel';
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
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
    this.api.signUp().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
      this.global.authToken = response.authToken;
      this.global.userId = response.userId;
      this.localDb.setGameSessionData();
      //alert("You have registered successfully");
      this.messagePopUp.isVisible= true;
      this.global.emailVerified = true;
      this.global.phoneVerified = false;
      if(this.global.isforgotPwd) this.messagePopUp.popupMessage = this.langModel.componentLang.popups.successpwd[this.langModel.lang];
      else this.messagePopUp.popupMessage = this.langModel.componentLang.popups.registerSuccess[this.langModel.lang];
     
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      this.isFail = 'successfull';
      
      
    },(e: any) => {
      //alert(JSON.stringify(e.error.message));
      this.messagePopUp.isVisible= true;
      if(e.error.message!= null) {
        this.messagePopUp.popupMessage = e.error.message;
        }else {
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          this.isFail = 'error';
        }
     
     // this.router.navigateByUrl('landingPage');
      });
  }
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
   
    if(evt == 'close'){
      if(this.isFail == 'successfull') {
        if(this.global.isforgotPwd) this.router.navigateByUrl('login');
      else this.router.navigateByUrl('user-details');
      }
      else if(this.isFail == 'error')this.router.navigateByUrl('register');
      if(this.messagePopUp.popupMessage == 'Email already exist'){
        this.router.navigateByUrl('register');
      }
    this.isFail = '';
    }
  }

}
