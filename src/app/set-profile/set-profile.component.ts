import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-set-profile',
  templateUrl: './set-profile.component.html',
  styleUrls: ['./set-profile.component.css']
})
export class SetProfileComponent implements OnInit {

  userName: string = "";
  selectedAvatar = 1;
  errorExist = false;
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private api: ApiServiceService,public global: GlobalDetails,private router: Router, private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.selectedAvatar = Number(this.global.avatar);
  }
  onSuccess(){
    this.soundService.playAudio('click');
    this.global.userName = this.userName;
    this.global.avatar = this.selectedAvatar;
    if(this.userName == "" && this.global.setProfile){
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.userName[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
    }else{
    this.api.updateUserName().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
     
      this.localDb.setGameSessionData();
      if(this.global.isClub == false )this.router.navigateByUrl('homePage');
      else this.router.navigateByUrl('createClub');
      //alert("You have registered successfully");
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
      this.isFail = 'error';
     // this.router.navigateByUrl('landingPage');
      });
    }
   
   
  }
  updateSelectedAvatar(avatar:any) {
    this.selectedAvatar = avatar;
    console.log(this.selectedAvatar,"this.selectedAvatar");
  }
  back(){
    this.soundService.playAudio('click');
    // if(this.global.setProfile == false)  this.router.navigateByUrl('profileLogout');
    // else 
    this.router.navigateByUrl('bank-info');
  }
  isFail: string = "";
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    if(evt == 'close'){
      // if(this.isFail == 'successfull') this.router.navigateByUrl('setProfile');
      // else if(this.isFail == 'error')this.router.navigateByUrl('register');
    this.isFail = '';
    }
  }
  chkPadding(){
    if(this.global.setProfile == true)
      {
        return { 'padding': '8px 13px'};
      }
      else{
        return { 'padding': '0 0'};
      }
  }
}
