import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { MessagingService } from 'src/services/messaging.service';
import { PushNotificationService } from 'src/services/push-notification.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {

  secStr: any = [];
  minStr: any = [];
  seconds = 0;
  minutes = 0;
  secondsP: any = [];
  minutesP: any = [];
  running : any = [];
  clockTime: any = [];
  startClock = false;
  timeouts: any = [];
  timerCount: any;
  tourStartTime: any;
  timeArray: any = [];
  Heading: string = "";

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private messagingService: MessagingService,public pushNoti: PushNotificationService,private router: Router, private api: ApiServiceService, public global: GlobalDetails, private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.Heading = this.langModel.componentLang.tournamentPage.heading[this.langModel.lang];
    this.global.tourDataArray = [];
    this.getDetails();
  }
  noTourMsg ="";
  regOpenChecker:any =[];
  getDetails() {
    if(this.global.tournamentType == "championship") {
      if(this.langModel.lang == 'en') this.Heading = "ChampionShip";
      else this.Heading = "Campeonato";
    }
    this.global.tourDataArray = [];
    this.api.upcomingTournaments(this.global.tournamentType).subscribe((data: any) => {
      // this.global.tourDataArray=data;
      console.log(data, "data>>>>>");
      
      for (var i = 0; i < data.length; i++) {
        if (data[i].gameType == "CHECKER" || data[i].gameType == "checker") data[i].gameType = 'Checkers';
        if (data[i].gameType == "LUDO" || data[i].gameType == "ludo") data[i].gameType = 'Ludo';
        console.log(data[i].gameType, " abcd", this.global.gameName);
        if (data[i].gameType == this.global.gameName) {
          this.global.tourDataArray.push(data[i]);
          console.log(this.global.tourDataArray, "chk123", this.global.tourDataArray.length);
        }
      }
      if(this.global.tourDataArray.length == 0){
        if(this.global.tournamentType == "championship") {
          if(this.langModel.lang == 'en') this.noTourMsg= "No Championship to occur ! Try again in sometime.";
          else this.noTourMsg= "Nenhum campeonato para ocorrer! Tente novamente em algum momento.";
        }
        else {
          if(this.langModel.lang == 'en') this.noTourMsg= "No Tournament to occur ! Try again in sometime.";
          else this.noTourMsg= "Nenhum Torneio a ocorrer! Tente novamente em algum momento.";
      }
      }
      for (var j in this.global.tourDataArray) {
        this.running[j] = false;
        this.clockTime[j] ="00:00";
        this.secStr[j]= "00";
        this.minStr[j]= "00";
        if(this.global.gameName == "Checkers") {
          var regOpen = new Date(this.global.tourDataArray[j].registrationOpens.slice(0, 19) + 'Z');
          var monthOpen = '' + (regOpen.getMonth() + 1),
          dayOpen = '' + regOpen.getDate(),
          yearOpen = regOpen.getFullYear();
      
          if (monthOpen.length < 2)
            monthOpen = '0' + monthOpen;
          if (dayOpen.length < 2)
            dayOpen = '0' + dayOpen;
      
          var finaldateOpen = [yearOpen, monthOpen, dayOpen].join('-');
          let finaltimeOpen = regOpen.toTimeString();
      
          console.log(finaldateOpen + 'T' + finaltimeOpen);
      
          this.regOpenChecker[j] = finaldateOpen + 'T' + finaltimeOpen;
          console.log("regopen", this.regOpenChecker[j]);
        }
       
        console.log(this.global.tourDataArray[j].registered, "val of j ", this.global.tourDataArray[j].startDate);
        if(this.global.tourDataArray[j].startDate!=null  ){
          this.getTourTime(this.global.tourDataArray[j].startDate.slice(0, 19), this.global.tourDataArray[j].endDate
          .slice(0, 19),this.global.tourDataArray[j].registrationOpens
          .slice(0, 19),this.global.tourDataArray[j].registrationClose.slice(0, 19), j);
        }else{
          this.timeArray[j] = ({ time: this.tourStartTime, clockStart: false });
        }
        
       
         //this.getTourTime("2023-01-25T18:44:00", "2023-01-26T19:05:00","2023-01-23T07:06:00","2023-01-25T13:06:00", j);
      }
    });
    
  }
  
  getTourTime(startDate: any, endDate:any, regOpen:any, regClose:any, index: any) {
    console.log("regClose", startDate, endDate,regOpen,regClose);
    var upcomingDate = new Date(startDate + 'Z');
    
    var milliseconds1 = upcomingDate.getTime();
    this.istConversion(upcomingDate,endDate, regOpen, regClose, index);
    //this.tourTimer(milliseconds1,index);
   
    var datenow = new Date();

    console.log("upcomingDate", upcomingDate, datenow);
    var milliseconds2 = datenow.getTime();
    var milliseconds = milliseconds1 - milliseconds2;
    this.timeRemaining(milliseconds,milliseconds1,index);
    // var bool = this.startClock;

    // this.timeArray[index] = ({ time: timeremain, clockStart: bool });
    // console.log("this.global.tourDataArray", this.global.tourDataArray);
    // timeremain = '';
    // bool = false;
  }
  istConversion(upcomingDate:any, endDate:any, regOpen:any, regClose:any,index:any){
    var enddate = new Date(endDate + 'Z');
    var regopen = new Date(regOpen + 'Z');
    var regclose = new Date(regClose + 'Z');
    console.log("regopen", regopen);
    var month = '' + (upcomingDate.getMonth() + 1),
    day = '' + upcomingDate.getDate(),
    year = upcomingDate.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    var finaldate = [year, month, day].join('-');
    let finaltime = upcomingDate.toTimeString();

    console.log(finaldate + 'T' + finaltime);

    this.global.tourDataArray[index].startDate = finaldate + 'T' + finaltime;
/////////////////////////////////////
    var monthEnd = '' + (enddate.getMonth() + 1),
    dayEnd = '' + enddate.getDate(),
    yearEnd = enddate.getFullYear();

    if (monthEnd.length < 2)
      monthEnd = '0' + monthEnd;
    if (dayEnd.length < 2)
      dayEnd = '0' + dayEnd;

    var finaldateEnd = [yearEnd, monthEnd, dayEnd].join('-');
    let finaltimeEnd = enddate.toTimeString();

    console.log(finaldateEnd + 'T' + finaltimeEnd);

    this.global.tourDataArray[index].endDate = finaldateEnd + 'T' + finaltimeEnd;
///////////////////////////////
    var monthOpen = '' + (regopen.getMonth() + 1),
    dayOpen = '' + regopen.getDate(),
    yearOpen = regopen.getFullYear();

    if (monthOpen.length < 2)
      monthOpen = '0' + monthOpen;
    if (dayOpen.length < 2)
      dayOpen = '0' + dayOpen;

    var finaldateOpen = [yearOpen, monthOpen, dayOpen].join('-');
    let finaltimeOpen = regopen.toTimeString();

    console.log(finaldateOpen + 'T' + finaltimeOpen);

    this.global.tourDataArray[index].registrationOpens = finaldateOpen + 'T' + finaltimeOpen;
/////////////////
    var monthClose = '' + (regclose.getMonth() + 1),
    dayClose = '' + regclose.getDate(),
    yearClose = regclose.getFullYear();

    if (monthClose.length < 2)
      monthClose = '0' + monthClose;
    if (dayClose.length < 2)
      dayClose = '0' + dayClose;

    var finaldateClose = [yearClose, monthClose, dayClose].join('-');
    let finaltimeClose = regclose.toTimeString();

    console.log(finaldateClose + 'T' + finaltimeClose);

    this.global.tourDataArray[index].registrationClose = finaldateClose + 'T' + finaltimeClose;
  }
  
  timeRemaining(milliseconds: any,milliseconds1 :any,index:any) {
    console.log("time remain", milliseconds);
    // if (this.secondsP != 0 && this.minutesP != 0) {
    //   console.log("hereeeee", this.secondsP)
    //   seconds = this.secondsP;
    //   minutes = this.minutesP;
    // }
    // else {
      console.log("wwwwhereeeee", this.minutesP)
      var seconds  = Math.floor((milliseconds / 1000) % 60);
      var minutes = Math.floor(((milliseconds / (1000 * 60)) % 60));
    //}
    var hours = Math.floor(((milliseconds / (1000 * 60 * 60)) % 24));
    var days = Math.floor((((milliseconds / 1000) / 60) / 60) / 24);
    console.log("time checkk", days, hours, minutes, seconds);

    if (milliseconds <= 0 || (days ==0 && hours==0 && minutes==0 && seconds==0)) {
      console.log("Check 1")
      if (this.langModel.lang == 'en') {
        if(this.global.tourDataArray[index].canJoin == false){
          this.tourStartTime = "Already Started!";
          this.clockTime[index] = "Already Started!";
        }
        else{
          this.tourStartTime = "Start Now";
          this.clockTime[index] = "Start Now";
        }
      }
      else {
        if(this.global.tourDataArray[index].canJoin == false){
          this.tourStartTime = "Já começou!";
          this.clockTime[index] = "Já começou!";
        }
        else{
          this.tourStartTime = "Começar";
          this.clockTime[index] = "Começar";
        }
       
      }
      //this.isTimerOver = true;
      //this.stop();
      this.startClock = false;
      var bool = this.startClock;

      this.timeArray[index] = ({ time: this.tourStartTime, clockStart: bool });
      console.log("this.global.tourDataArray", this.global.tourDataArray);
      this.tourStartTime = '';
      bool = false;
    } else if (days == 1) {
      // console.log("Check 2")
      this.tourStartTime = days + " day left";
      this.startClock = false;
      this.tourTimer(milliseconds1,index,seconds,minutes);
      var bool = this.startClock;

      this.timeArray[index] = ({ time: this.tourStartTime, clockStart: bool });
      console.log("this.global.tourDataArray", this.global.tourDataArray);
      this.tourStartTime = '';
      bool = false;
    } else if (days > 1) {
      // console.log("Check 3")
      this.tourStartTime = days + " days left";
      this.startClock = false;
      this.tourTimer(milliseconds1,index,seconds,minutes);
      var bool = this.startClock;

      this.timeArray[index] = ({ time: this.tourStartTime, clockStart: bool });
      console.log("this.global.tourDataArray", this.global.tourDataArray);
      this.tourStartTime = '';
      bool = false;
    } else if (hours == 1) {
      // console.log("Check 4",hours)
      this.tourStartTime = hours + " hour left";
      this.startClock = false;
      this.tourTimer(milliseconds1,index,seconds,minutes);
      var bool = this.startClock;

      this.timeArray[index] = ({ time: this.tourStartTime, clockStart: bool });
      console.log("this.global.tourDataArray", this.global.tourDataArray);
      this.tourStartTime = '';
      bool = false;
    } else if (hours > 1) {
      // console.log("Check 4",hours)
      this.tourStartTime = hours + " hours left";
      this.startClock = false;
      this.tourTimer(milliseconds1,index,seconds,minutes);
      var bool = this.startClock;

      this.timeArray[index] = ({ time: this.tourStartTime, clockStart: bool });
      console.log("this.global.tourDataArray", this.global.tourDataArray);
      this.tourStartTime = '';
      bool = false;
    } else if (hours < 1) {
      //  console.log("Check 5")
      this.tourStartTime = 0;
      this.startClock = true;
      //console.log("Check 5")
      this.secondsP[index] = seconds;
      this.minutesP[index] = minutes;

      //this.start();
      this.running[index] = true;
      this.tourTimer(milliseconds1,index,seconds,minutes);
      var bool = this.startClock;

      this.timeArray[index] = ({ time: this.tourStartTime, clockStart: bool });
      console.log("this.global.tourDataArray", this.global.tourDataArray);
      this.tourStartTime = '';
      bool = false;
      
    }
    
    //return this.tourStartTime;
  }
  tourTimer(milliseconds1:any,index:any,seconds:any,minutes:any){
    var self =this;
    console.log("datenow11", index,minutes,this.global.tourDataArray[index].registered);
    if(this.global.tourDataArray[index].registered) {
      console.log("hereee");
  //   self.clearTour = setTimeout(() => {
  //     clearTimeout(self.clearTour);
  //     var datenow = new Date();
  //     console.log("datenow", datenow);
  //     var milliseconds2 = datenow.getTime();
  //     var milliseconds = milliseconds1 - milliseconds2;
  //     self.timeRemaining(milliseconds,milliseconds1,index);
  //     if (self.running[index] == true) self.updateTime(index,seconds,minutes);
     
  // }, 1000);

  var timeoutId = setTimeout(() => {
    clearTimeout(self.timeouts[index]);
    var datenow = new Date();
    var milliseconds2 = datenow.getTime();
    var milliseconds = milliseconds1 - milliseconds2;
    self.timeRemaining(milliseconds, milliseconds1, index);
    if (self.running[index] == true) self.updateTime(index, seconds, minutes);
  }, 1000);
  this.timeouts[index] = timeoutId;
} 
  }

  // stop() {
  //   //this.running[index] = false;
  //   clearTimeout(this.clearTour);
  // };
  stop(index: any) {
    if (this.timeouts[index]) {
      clearTimeout(this.timeouts[index]);
    }
    this.running[index] = false;
  }

  clear() {
    this.secondsP = 0;
    this.minutesP = 0;
  };
  clearTour: any;

  updateTime(index:any,seconds:any,minutes:any) {
    this.secondsP[index]--;
    
    if (this.secondsP[index] < 0) {
      this.secondsP[index] = 59;
      this.minutesP[index]--;
    }
    if(this.minutesP[index] <= 0) this.minutesP[index] == 0;
    console.log("Check min and sec",index,this.minutesP[index],this.secondsP[index]);
    if (this.secondsP[index] < 10) {
      this.secStr[index] = "0" + this.secondsP[index];
    } else {
      this.secStr[index] = (this.secondsP[index]).toString();
    }
    if (this.minutesP[index] < 10) {
      this.minStr[index] = "0" + this.minutesP[index];
    } else {
      this.minStr[index] = (this.minutesP[index]).toString();
    }
    // console.log("PPPPPPPPPPPPP", this.minStr, this.secStr)

    if (this.langModel.lang == 'en') this.clockTime[index] = "Starts in " + this.minStr[index] + ":" + this.secStr[index];
    else this.clockTime[index] = "Começa em " + this.minStr[index] + ":" + this.secStr[index];

    //console.log("before start",this.clockTime);
    if (Number(this.minStr[index]) == 0 && Number(this.secStr[index]) == 0) {
      console.log("before start 1123");
      this.running[index] = false;
      this.stop(index);
      if (this.langModel.lang == 'en') this.clockTime[index] = "Start Now";
      else this.clockTime[index] = "Começar";
    }
    //  console.log("clock ticking",this.clockTime);
  }
  onClaim(evt: any) {
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible = false;
    if (evt == 'close') {
      // if(this.isFail == 'successfull') this.router.navigateByUrl('setProfile');
      // else if(this.isFail == 'error')this.router.navigateByUrl('register');

    }
  }

  onJoin(tournament_id: number, index: number) {
    this.soundService.playAudio('click');
    console.log("tournament_id -> ", tournament_id);
    
      this.api.registerToTournament(tournament_id).subscribe((data) => {
        console.log("response for registering -> ", data);
        if (data.status == false) {
          console.log("message>>>> ", data.msg);
          if (data.msg.startsWith("Player have insufficient balance")) {
            this.messagePopUp.isVisible = true;
            this.messagePopUp.popupMessage = this.langModel.componentLang.popups.lowBal[this.langModel.lang];
            this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
          else if (data.msg == "Registration date is close for the tournament") {
            this.messagePopUp.isVisible = true;
            this.messagePopUp.popupMessage = this.langModel.componentLang.popups.regTimeup[this.langModel.lang];
            this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
          else if (data.msg == "No more seats left for the tournament") {
            this.messagePopUp.isVisible = true;
            this.messagePopUp.popupMessage = this.langModel.componentLang.popups.noMoreSeats[this.langModel.lang];
            this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
          else if (data.msg == "Registration Not Opened yet.") {
            this.messagePopUp.isVisible = true;
            this.messagePopUp.popupMessage = this.langModel.componentLang.popups.regNotOpen[this.langModel.lang];
            this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
        }
        else {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.isRegistered[this.langModel.lang];
          this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          this.global.coins = data.coins.toFixed(2);
          this.global.moneyAmt = (this.global.coins * this.global.moneyVal).toFixed(2);
          // this.getTourTime(this.global.tourDataArray[index].startDate.slice(0, 19),index)
          this.getDetails();
          if(this.global.onMobile) this.pushNoti.subscribeTopic(tournament_id);
          else {
            if(this.global.notifyPermission == 'granted')this.checkToken(tournament_id);
          }
          
         // this.message = this.messagingService.currentMessage;
        
      }
      });
    
  }
  checkToken(tournament_id:number) {
    if (this.messagingService.token == undefined) {
      this.messagingService.requestPermission().subscribe(tokenBool => {
        console.log(tokenBool, "this.messagingService.token11111111");
        if (!tokenBool) {
          this.checkToken(tournament_id);
        }
      });
    }
    else{
      console.log("token is hereeee");
       
        this.messagingService.subscribeTokenToTopic(tournament_id);
        this.messagingService.receiveMessage();
      
    }
  }
  gameStarted = false;
  enterGame(tournament_id: number, tournamentStartTime: any, t_name: string, entryFees:any, firstP:any, secondP:any, thirdP:any,index:any) {
    
      this.soundService.playAudio('click');
      console.log("enter game -> ", this.clockTime[index]);
    if (this.clockTime[index] == "Start Now" || this.clockTime[index] == "Começar") {
    this.api.checkTournamentStatus(String(tournament_id)).subscribe((data)=>{
      console.log("tournament start data -> " + data);
      if(data){
        if (this.global.gameName == "Ludo") {
          this.global.LudoGameType = "Tourny";
          //this.global.ludoEntryAmt = entryFees;
          this.global.ludoRewardAmt = firstP;
          this.global.ludoSecRewardAmt = secondP;
          this.global.ludoThirdRewardAmt = thirdP;
          this.global.TournamentStartObject.tournament_id = tournament_id;
          this.global.TournamentStartObject.tournamentStartTime = tournamentStartTime;
          this.global.TournamentStartObject.t_name = t_name;
          this.global.TournamentStartObject.round = 1;
          this.gameStarted = true;
          this.router.navigateByUrl("ludoGame");
        } else {
          this.global.checkersGameType = "Tourny";
          //this.global.checkerEntryAmt = entryFees;
          this.global.checkerSecRewardAmt = secondP;
          this.global.checkerRewardAmt = firstP;
          this.global.TournamentStartObject.tournament_id = tournament_id;
          this.global.TournamentStartObject.tournamentStartTime = tournamentStartTime;
          this.global.TournamentStartObject.t_name = t_name;
          this.global.TournamentStartObject.round = 1;
          this.gameStarted = true;
          this.router.navigateByUrl("checkers");
        }
      }else{
        if(this.langModel.lang == "en"){
          this.clockTime[index] = "Already Started!";
          this.timeArray[0].time = "Already Started!";
        }
        else{
          this.clockTime[index] = "Já começou!";
          this.timeArray[0].time = "Já começou!";
        }
        this.messagePopUp.isVisible = true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.TournamentStatus[this.langModel.lang]
        
      }
    }, (e)=>{
      console.log("error getting tourny status : ", e.message);
      this.messagePopUp.isVisible = true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.refreshPage[this.langModel.lang]

    })
    }
    
    
  }
  back() {
    this.soundService.playAudio('click');
    for( var j in this.running){
      this.stop(j);
    }
    this.global.isPlaying = false;
    this.router.navigateByUrl('ludoLandingPage');
  }
  tourneyDetails(id: any) {
    this.global.id = id;
    for( var j in this.running){
      this.stop(j);
    }
    
    this.soundService.playAudio('click');
    this.router.navigateByUrl('tournament-details');
  }
  gameCheck(type: any) {
    switch (type) {
      case 'bg':
        if (this.global.gameName == "Ludo") {
          return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)' };
        }
        else {
          return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(./../../assets/BG_1px.png)' };
        }
        break;
      case 'redbox':
        if (this.global.gameName == "Ludo") {
          return { 'background-color': '#9a0e0e' };
        }
        else {
          return { 'background-color': '#006200' };
        }
        break;
      case 'redBox-header':
        if (this.global.gameName == "Ludo") {
          return { 'color': '#9a0e0e' };
        }
        else {
          return { 'color': '#006200' };
        }
        break;
      case 'back-header':
        if (this.global.gameName == "Ludo") {
          return { 'background': 'url(../../assets/img1/Header_Stretchable.png) 0/100% 100% no-repeat' };
        }
        else {
          return { 'background': 'url(../../assets/Checkers_Home/header.png) 0/100% 100% no-repeat' };
        }
        break;

      case 'yellowbtn':
        if (this.global.gameName == "Ludo") {
          return {
            'background': 'url(../../assets/img1/Button_Yellow.png) 0/100% 100% no-repeat',
            'color': '#9a0e0e'
          };
        }
        else {
          return {
            'background': 'url(../../assets/Checkers_Home/button_red.png) 0/100% 100% no-repeat',
            'color': '#fff'
          };
        }
        break;
      case 'greenbtn':
        if (this.global.gameName == "Ludo") {
          return {
            'background': 'url(../../assets/img1/button_green_bg.png) 0/100% 100% no-repeat',
            'color': '#fff'
          };
        }
        else {
          return {
            'background': 'url(../../assets/img1/Button_Yellow.png) 0/100% 100% no-repeat',
            'color': '#006200'
          };
        }
        break;
      case 'betbox':
        if (this.global.gameName == "Ludo") {
          return { 'background': 'url(../../assets/img1/randomPlay/textbox.png) 0/100% 100% no-repeat' };
        }
        else {
          return { 'background': 'url(../../assets/Checkers_Home/textboxChecker.png) 0/100% 100% no-repeat' };
        }
        break;
      default:
        return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)' };
    }
  }
}
