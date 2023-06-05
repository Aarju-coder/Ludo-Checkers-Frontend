import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  
  portuguese: boolean = true;
  constructor(private router: Router, private localDb: LocalDbService, public global: GlobalDetails, private soundService: SoundServiceService, public langModel: LanguageModel) {
    
  }

  ngOnInit(): void {
    this.global.isforgotPwd = false;
    if(this.global.internetAvailable == false){
      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage = "No Internet Connection";
    }else {
      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage = "Internet Connection Available";
    }
    this.checkIfLoggedIn();
    this.getSounds();
    if(this.global.isPortuguese) 
    {
      var language: any = document.getElementById("radio-1");
      language.checked = true;
    }
    else{
      var language: any = document.getElementById("radio-2");
      language.checked = true;
    }
  }
 
  back() {
    this.soundService.playAudio('click');
    this.router.navigateByUrl('clubLandingPage');
  }
  languageClicked(){
    var language: any = document.getElementById("radio-1");
    if (language.checked == true) {
      this.portuguese = true;
    } else {
      this.portuguese = false;
    }
    this.global.isPortuguese = this.portuguese;
    if(this.global.isPortuguese) this.langModel.lang = "pt";
    else this.langModel.lang = "en";

    this.localDb.setSoundsDb();
  }
  
  getSounds(){
    var soundSession = this.localDb.getSoundsDb();
    console.log(soundSession, "soundSessionsoundSession");
    if (soundSession.length != 0) {
      this.global.soundPlaying = soundSession.musicBool;
      this.global.sound2Playing = soundSession.soundBool;
      this.global.isPortuguese = soundSession.language;
      if(this.global.isPortuguese) this.langModel.lang = "pt";
      else this.langModel.lang = "en";
    }
  }
  checkIfLoggedIn() {
    var dataSession = this.localDb.getGameSessionData();
    console.log(dataSession, "dataSessiondataSession");
    if (dataSession.length != 0) {
      this.global.authToken = dataSession.authToken;
      this.global.userId = dataSession.userId;
      this.global.userName = dataSession.userName;
      this.global.avatar = dataSession.avatar;

      this.global.firstName = dataSession.firstName;
      this.global.lastName = dataSession.lastName;
      this.global.dOb = dataSession.dOb;
      this.global.address = dataSession.address;
      this.global.myEmail = dataSession.myEmail;
      this.global.myphone = dataSession.myphone;
      this.global.gender = dataSession.gender;
      this.global.accNum = dataSession.accNum;
      this.global.bankName = dataSession.bankName;
      this.global.expPhoneNumber = dataSession.expPhoneNumber;
      this.global.coins = dataSession.coins;
      this.global.moneyAmt = dataSession.moneyAmt;
      this.router.navigateByUrl('homePage');
    }
  }
  loginPage() {
      this.soundService.playAudio('click');
      this.router.navigateByUrl('login');
  }
  register() {
      this.soundService.playAudio('click');
      this.router.navigateByUrl('register');
  }

  phoneLogin() {
      this.soundService.playAudio('click');
      this.router.navigateByUrl('phoneLogin');
    
  }
  onClaim(evt: any) {
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible = false;

  }
  onTnc() {
    this.soundService.playAudio('click');
    this.router.navigateByUrl('tnc');
  }
}
