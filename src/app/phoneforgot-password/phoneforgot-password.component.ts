import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-phoneforgot-password',
  templateUrl: './phoneforgot-password.component.html',
  styleUrls: ['./phoneforgot-password.component.css']
})
export class PhoneforgotPasswordComponent implements OnInit {
  phone:number=NaN
  invalidphone:boolean=false
  code:any;
  codeArray=[
    {countryCode:"244"},
    {countryCode:"243"},
    {countryCode:"245"},
  ]
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router:Router,private global: GlobalDetails, private api: ApiServiceService,
    private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.code=this.codeArray[0].countryCode

  }

  validateDetails(){
    this.soundService.playAudio('click');
    var emailValid = this.phoneCheck(this.phone);
      if(this.phoneCheck(this.phone) == false){ //phoneValid==false
        this.invalidphone=true;
        //alert("Enter Correct phone Address");
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.phnCorrct[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        console.log('invalidphoneornot--------->',this.phoneCheck(this.phone),"---------invalidphone",this.invalidphone);
      }
      else {
        // this.global.myEmail = this.code+" "+ this.phone;

        this.global.myphone=this.phone;
        this.global.countryCode=this.code;
        
        this.api.phoneOtpResend().subscribe((data)=>{
          
          console.log( data," this.res this.res");
        });
        this.global.isforgotPwd = true;
        this.router.navigateByUrl('phonesignupOTP');
        console.log("globalPhoneNumber-------->",this.global.countryCode ,this.global.myphone);
        
        // this.login();
      }

      // if(this.invalidEmail == false){
      //   this.router.navigateByUrl('setPassword');
      //   console.log('setPassword route');
      // }
      console.log("check phone",emailValid);
  }
  phoneCheck(email: any){
    var re = /[0-9]/;
    if (!(re.test(email))) {
      return false;
    }
    else{
      return true;
    }	
  }
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    // if(evt == 'close'){
    //   if(this.isFail == 'successfull') this.router.navigateByUrl('homePage');
    //   else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
    // this.isFail = '';
    // }
  }

  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl("phoneLogin")
  }


}
