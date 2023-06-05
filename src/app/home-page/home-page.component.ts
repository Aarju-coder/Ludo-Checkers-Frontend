import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

declare var particlesJS: any;
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  avatarimg:any;
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router: Router ,private localDb: LocalDbService,private api: ApiServiceService, public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }
  
  ngOnInit(): void {
    this.global.isClub = false;
    this.getUserDetails();
    this.getCoins();
    this.getGamesRankLudo();
    this.getGamesRankCheckers();
    this.getAds();
    this.global.isforgotPwd = false;
    this.avatarimg = "../../assets/img/profile/Avatar"+this.global.avatar+".png";
    particlesJS.load('particles-js', 'assets/json_files/particlesjs-config.json', null);
    this.soundService.stopMusic();
    this.global.isPlaying =false;
    this.global.gameName ="Home";
   
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('clubLandingPage');
  }
  getAds(){
    this.api.getAds().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
     // this.avatarimg = response.name;
     this.global.adimg1 = 'data:image/jpeg;base64,' + response[0].picByte;
     this.global.adimg2 = 'data:image/jpeg;base64,' + response[1].picByte;
     this.global.adimg3 = 'data:image/jpeg;base64,' + response[2].picByte;
     this.global.adimg4 = 'data:image/jpeg;base64,' + response[3].picByte;
      
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
      });
    
  }
  getUserDetails(){
    this.api.getUserDetails().subscribe((data) => {
      var response = data;
      console.log("response---------->",response,response.userName);
      if(response.userName == null ) response.userName ='Genilson';
      this.global.userName = response.userName;
      if(response.avatarId == 0 ) response.avatarId =1;
      this.global.avatar = response.avatarId;
      this.avatarimg = "../../assets/img/profile/Avatar"+this.global.avatar+".png";
      
      this.global.firstName = response.firstName;
      this.global.lastName = response.lastName;
      if(response.dob != null ){
        var result = response.dob.slice(0, 10);
        this.global.dOb = result;
      }
      this.global.address = response.address;
      this.global.myEmail = response.email;
      this.global.myphone = response.phoneNumber;
      if(response.gender != null ){
        if(response.gender == "male") response.gender ="Male";
        if(response.gender == "female") response.gender ="Female";
        this.global.gender = response.gender;
      }
      if(response.bankAccNum != null ){
        this.global.accNum = response.bankAccNum.slice(5);
      }
      // this.global.accNum = response.bankAccNum.slice(5);
      this.global.bankName = response.bankName;
      this.global.expPhoneNumber = response.expressPhoneNumber;
      this.global.phoneVerified = response.phoneVerified;
      this.global.emailVerified = response.emailVerified;
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.sessionExpired[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.closeChecker[this.langModel.lang];
      this.messagePopUp.type = 'option';
      this.messagePopUp.btnText = this.langModel.componentLang.popups.next[this.langModel.lang];
      
      // if(e.error.message!= null) {
      //   this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
      //   }else {
      //     this.messagePopUp.popupMessage = "Connection error. Try Again.";
      //   }
    //  this.router.navigateByUrl('landingPage');
      });
    
  }
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    if(evt == 'close'){
      // if(this.isFail == 'successfull') this.router.navigateByUrl('setProfile');
      // else if(this.isFail == 'error')this.router.navigateByUrl('register');
    
    }
    else{
      this.soundService.playAudio('click');
    localStorage.clear();
    this.global.isforgotPwd = false;
    this.global.setProfile = true;
    this.global.avatar = 1;
    this.global.userName = 'Genilson';

    this.global.firstName = "";
    this.global.lastName = "";
    this.global.dOb = "";
    this.global.address = "";
    this.global.myEmail = "";
    this.global.gender = "Male";
    this.global.accNum = "";
    this.global.bankName = "";
    this.global.expPhoneNumber = NaN;
    this.global.phoneVerified = true;
    this.global.emailVerified = true;
    this.global.coins = 0;
    this.global.moneyAmt = 0;
    this.global.isAgeCheck = false;
    this.global.isPortuguese = true;
    this.global.soundPlaying = true;
    this.global.sound2Playing = true;
    this.langModel.lang = "pt";
    this.router.navigateByUrl('landingPage');
    }
  }
  getCoins(){
    this.api.getCoins().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
     this.global.coins = (response.coins).toFixed(2);
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
    this.api.getRealMoney().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
    // this.global.coins = response.coins;
     this.global.moneyAmt = (this.global.coins * response[0].value).toFixed(2);
     this.global.moneyVal = (response[0].value).toFixed(2);
     this.localDb.setGameSessionData();
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
  getGamesRankLudo(){
    this.api.getRank("ludo").subscribe((data) => {
      var response = data;
      console.log("response of games---------->",response);
     this.global.winsLudo = response.wins;
      
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
  getGamesRankCheckers(){
    this.api.getRank("checkers").subscribe((data) => {
      var response = data;
      console.log("response of games---------->",response);
     this.global.winsCheckers = response.wins;
      
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
  checkers(){
    this.soundService.playAudio('click');
    this.global.gameName ="Checkers";
    this.router.navigateByUrl('ludoLandingPage');
    //this.router.navigateByUrl('checkers');
    this.localDb.setGameSessionData();
  }
  ludoGames(){
    this.soundService.playAudio('click');
    this.global.gameName ="Ludo";
    this.router.navigateByUrl('ludoLandingPage');
    this.localDb.setGameSessionData();
  }
  setting(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('settings')
  }
  profileRoute(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('profileLogout');
  }
  storeClicked(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('store');
  }
  walletClicked(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('wallet');
  }
}
