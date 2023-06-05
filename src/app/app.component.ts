import { LocationStrategy } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InternetConnectionService } from 'src/services/internet-connection.service';
import { LocalDbService } from 'src/services/local-db.service';
import { MessagingService } from 'src/services/messaging.service';
import { PushNotificationService } from 'src/services/push-notification.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from './globalVars';
import { LanguageModel } from './language/langModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lAndC';

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    let result = confirm("Changes you made may not be saved.");
    if (result) {
      // Do more processing...
     // console.log("condition",result);
      
    }
    event.returnValue = false; // stay on same page
  }
  ngOnInit() {
    // let permission = Notification.permission;

    // if(permission === "granted"){
    //    showNotification();
    // } else if(permission === "default"){
    //    requestAndShowPermission();
    // } else {
    //   alert("Use normal alert");
    // }
    
    // function requestAndShowPermission() {
    //     Notification.requestPermission(function (permission) {
    //         if (permission === "granted") {
    //             showNotification();
    //         }
    //     });
    // }
    // function showNotification() {
    //   //  if(document.visibilityState === "visible") {
    //   //      return;
    //   //  }
    //    let title = "Ludo and Checkers";
    //    let icon = 'https://homepages.cae.wisc.edu/~ece533/images/zelda.png'; //this is a large image may take more time to show notifiction, replace with small size icon
    //    let body = "Message to be displayed";
    
    //    let notification = new Notification(title, { body, icon });
    
    //    notification.onclick = () => {
    //           notification.close();
    //           window.parent.focus();
    //    }
       
    // }
}

  constructor(private messagingService: MessagingService,private location: LocationStrategy,public global:GlobalDetails,public langModel: LanguageModel,private localDb: LocalDbService,public pushNoti: PushNotificationService,private soundService: SoundServiceService){
   if(window.navigator.onLine){
    this.global.internetAvailable = true;
   }
  // setInterval(() => {
  //   console.log(window.innerWidth/window.innerHeight,"window.innerheight");
  // }, 1000);
    console.log('Requesting permission...', this.global.deviceDetect());
    if(!this.global.onMobile){
    try{
    Notification.requestPermission().then((permission) => {
      console.log(permission,'permission...');
      if (permission == 'granted') {
        console.log('Notification permission granted.');
        this.global.notifyPermission = 'granted';
        this.checkToken();
      }
      else{
        this.global.notifyPermission = 'denied';
      }
      })
    }
    catch(err){
      console.log('Err...'+err);
    } 

   history.pushState(null, '', null);
    // check if back or forward button is pressed.
    this.location.onPopState(() => {
        history.pushState(null, '', null);
        //history.go(0);
       
       // this.stepper.previous();
       //let result = confirm("Back Changes you made may not be saved.");
      // if(this.count==1) 
       //alert("Changes you made may not be saved.");
    });
  }
   console.log("in app component");
   if(this.global.isClub ==false){
    this.checkIfLoggedIn();
    this.getSounds();
   }
    document.addEventListener('deviceready',this.setupFcm.bind(this));
    document.addEventListener('backbutton', (evt) => this.backbtn(evt),false);
    document.addEventListener('pause', (evt) => this.bgmode(evt));
    document.addEventListener('resume', (evt) => this.bgmodeback(evt));
  }
  // onNotify(){
  //   console.log('Requesting permission...');
  //   try{
  //     window.Notification.requestPermission().then((permission) => {
  //     alert(permission+'..permission...');
  //     if (permission == 'granted') {
  //       console.log('Notification permission granted.');
  //       this.global.notifyPermission = 'granted';
  //       this.checkToken();
  //     }
  //     else{
  //       this.global.notifyPermission = 'denied';
  //     }
  //     })
  //   }
  //   catch(err){
  //     alert('Err...'+err);
  //   }
  // }
  checkToken() {
    if (this.messagingService.token == undefined) {
      this.messagingService.requestPermission().subscribe(tokenBool => {
        console.log(tokenBool, "this.messagingService.token11111111");
        if (!tokenBool) {
          this.checkToken();
          console.log("token is not hereeee");
        }
        
        else {
          console.log("token is hereeee");
        //   this.messagingService.subscribeTokenToTopic(2222);
        // this.messagingService.receiveMessage();
        }
      });
    }
   // else{
     
    //}
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
      this.global.moneyVal = dataSession.moneyVal;
      this.global.gameName = dataSession.gameName;
    }
  }
  
  setupFcm(){
    if(this.global.onMobile) this.pushNoti.setupFcm();
  }
  backbtn(evt:any){
    evt.preventDefault();
  }
  bgmode(evt:any){
    // on background mode
    if(this.global.soundPlaying) {
      this.soundService.stopMusic();
    }

    if(this.global.sound2Playing) {
      this.soundService.stopeGameSound();
    }
  }
  bgmodeback(evt:any){
    if(this.global.soundPlaying) {
       if(this.global.gameName =="Ludo" || this.global.gameName =="Checkers"){
      //   this.soundService.soundName ="ludostart";
         this.soundService.startMusic();
       }
       //else if(this.global.gameName =="Checkers"){
      //   this.soundService.soundName ="Homepage";
      //   this.soundService.startMusic();
      // }
      // this.soundService.soundName ="Championship";
      // this.soundService.startMusic();
    }
    // resume from bg mode
  }
  
}
