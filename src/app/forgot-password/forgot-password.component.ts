import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email:string=''
  invalidEmail:boolean=false
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router: Router, private global: GlobalDetails, private api: ApiServiceService,
    private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
  }

  validateDetails(){
    this.soundService.playAudio('click');
    var emailValid = this.emailCheck(this.email);
      if(this.emailCheck(this.email) == false){ //emailValid==false
        this.invalidEmail=true;
        //alert("Enter Correct Email Address");
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongEmail[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        console.log('invalidEmailornot--------->',this.emailCheck(this.email),"---------invalidEmail",this.invalidEmail);
      }
      else {
        this.global.myEmail = this.email;
        this.global.isforgotPwd = true;
        this.api.getOtpEmail().subscribe((data) => {
          var response = data;
          console.log("response---------->",response);
          
          if(response.success)this.router.navigateByUrl("emailOTP");
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
         // this.isFail = 'error';
         // this.router.navigateByUrl('landingPage');
          });
        
        console.log("globalEmail-------->",this.global.myEmail);
        
        // this.login();
      }

      // if(this.invalidEmail == false){
      //   this.router.navigateByUrl('setPassword');
      //   console.log('setPassword route');
      // }
      console.log("check email",emailValid);
  }
  emailCheck(email: any){
    var re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
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
    
    // if(this.global.isAccessClub==true)this.router.navigateByUrl('accessClub');
    //else
     this.router.navigateByUrl("login");
    }
    
  
}
